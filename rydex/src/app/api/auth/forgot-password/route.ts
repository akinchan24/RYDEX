import connectDb from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ message: "email is required" }, { status: 400 });
        }

        await connectDb();
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "no account found with this email" }, { status: 404 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendMail(email, "Your RYDEX password reset code", `<h2>Your password reset code is <strong>${otp}</strong></h2><p>This code expires in 10 minutes.</p>`);
        return NextResponse.json({ message: "reset code sent" });
    } catch (error) {
        return NextResponse.json({ message: `forgot password error ${error}` }, { status: 500 });
    }
}