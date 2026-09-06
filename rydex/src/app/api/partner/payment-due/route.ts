import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb()
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json({ message: "user is not authenticated" }, { status: 401 })
        }

        const partner = await User.findOne({ email: session.user.email, role: "partner" })
            .select("pendingAppPayment totalAppCommission")

        if (!partner) {
            return NextResponse.json({ message: "partner not found" }, { status: 404 })
        }

        return NextResponse.json({
            pendingAppPayment: partner.pendingAppPayment ?? 0,
            totalAppCommission: partner.totalAppCommission ?? 0,
        })
    } catch {
        return NextResponse.json({ message: "payment due error" }, { status: 500 })
    }
}