import { auth } from "@/auth";
import connectDb from "@/lib/db";
import razorpay from "@/lib/razorpay";
import AppPayment from "@/models/appPayment.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectDb()
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ message: "user is not authenticated" }, { status: 401 })
        }

        const partner = await User.findOne({ email: session.user.email, role: "partner" })
        if (!partner) {
            return NextResponse.json({ message: "partner not found" }, { status: 404 })
        }

        const amount = Number((partner.pendingAppPayment ?? 0).toFixed(2))
        if (amount <= 0) {
            return NextResponse.json({ message: "no payment due" }, { status: 400 })
        }

        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `app-payment-${partner._id}-${Date.now()}`,
        })

        await AppPayment.create({
            partner: partner._id,
            amount,
            orderId: order.id,
        })

        return NextResponse.json({ orderId: order.id, amount: order.amount })
    } catch (error) {
        return NextResponse.json({ message: `payment create error ${error}` }, { status: 500 })
    }
}