import { auth } from "@/auth";
import connectDb from "@/lib/db";
import AppPayment from "@/models/appPayment.model";
import User from "@/models/user.model";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

        if (!session?.user?.email || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ success: false, message: "invalid payment data" }, { status: 400 })
        }

        const partner = await User.findOne({ email: session.user.email, role: "partner" }).select("_id")
        const payment = await AppPayment.findOne({
            orderId: razorpay_order_id,
            partner: partner?._id,
            status: "created",
        })
        if (!partner || !payment) {
            return NextResponse.json({ success: false, message: "payment order not found" }, { status: 400 })
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex")
        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ success: false, message: "invalid signature" }, { status: 400 })
        }

        const updatedPartner = await User.findOneAndUpdate(
            { _id: partner._id, pendingAppPayment: { $gte: payment.amount } },
            { $inc: { pendingAppPayment: -payment.amount } },
            { new: true },
        )
        if (!updatedPartner) {
            return NextResponse.json({ success: false, message: "payment balance has changed" }, { status: 409 })
        }

        payment.paymentId = razorpay_payment_id
        payment.status = "paid"
        await payment.save()

        return NextResponse.json({ success: true, paidAmount: payment.amount, pendingAppPayment: updatedPartner.pendingAppPayment })
    } catch (error) {
        return NextResponse.json({ success: false, message: `payment verify error ${error}` }, { status: 500 })
    }
}