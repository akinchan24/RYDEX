import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import PartnerBank from "@/models/partnerBank.model";
import User from "@/models/user.model";
import Withdrawal from "@/models/withdrawal.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ message: "user is not authenticated" }, { status: 401 })
        }

        const partner = await User.findOne({ email: session.user.email, role: "partner" }).select("_id")
        if (!partner) {
            return NextResponse.json({ message: "partner not found" }, { status: 404 })
        }

        const bank = await PartnerBank.findOne({ owner: partner._id, status: "verified" }).select("_id")
        if (!bank) {
            return NextResponse.json({ message: "verified bank account required" }, { status: 400 })
        }

        const requestedAmount = Number((await req.json()).amount)
        if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
            return NextResponse.json({ message: "invalid withdrawal amount" }, { status: 400 })
        }

        const onlineBookings = await Booking.find({
            driver: partner._id,
            paymentStatus: "paid",
            bookingStatus: "completed",
            paymentMethod: "online",
        }).select("partnerAmount")
        const receivedOnline = onlineBookings.reduce((total, booking) => total + (booking.partnerAmount ?? 0), 0)
        const existingWithdrawals = await Withdrawal.find({
            partner: partner._id,
            status: { $in: ["pending", "paid"] },
        }).select("amount")
        const alreadyRequested = existingWithdrawals.reduce((total, withdrawal) => total + withdrawal.amount, 0)
        const available = receivedOnline - alreadyRequested

        if (requestedAmount > available) {
            return NextResponse.json({ message: "withdrawal exceeds available online earnings" }, { status: 400 })
        }

        const withdrawal = await Withdrawal.create({
            partner: partner._id,
            amount: Number(requestedAmount.toFixed(2)),
            bank: bank._id,
        })
        return NextResponse.json({ success: true, withdrawalId: withdrawal._id, status: withdrawal.status })
    } catch (error) {
        return NextResponse.json({ message: `withdrawal request error ${error}` }, { status: 500 })
    }
}