import { auth } from "@/auth";
import connectDb from "@/lib/db";
import AppPayment from "@/models/appPayment.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb()
        const session = await auth()
        if (session?.user?.role !== "admin") {
            return NextResponse.json({ message: "unauthorized" }, { status: 401 })
        }

        const [summary] = await AppPayment.aggregate([
            { $match: { status: "paid" } },
            { $group: { _id: null, totalReceived: { $sum: "$amount" }, paymentsCount: { $sum: 1 } } },
        ])

        const partnersDue = await User.find({
            role: "partner",
            pendingAppPayment: { $gt: 0 },
        })
            .select("name email mobileNumber pendingAppPayment")
            .sort({ pendingAppPayment: -1 })
            .lean()

        return NextResponse.json({
            totalReceived: summary?.totalReceived ?? 0,
            paymentsCount: summary?.paymentsCount ?? 0,
            partnersDue: partnersDue.map((partner) => ({
                id: partner._id,
                name: partner.name,
                email: partner.email,
                mobileNumber: partner.mobileNumber ?? "Not provided",
                pendingAppPayment: partner.pendingAppPayment ?? 0,
            })),
        })
    } catch {
        return NextResponse.json({ message: "admin app payments error" }, { status: 500 })
    }
}