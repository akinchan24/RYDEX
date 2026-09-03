import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, otp, password } = await req.json();
        if (!email || !otp || !password) {
            return NextResponse.json({ message: "email, code, and password are required" }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ message: "password must be at least 6 characters" }, { status: 400 });
        }

        await connectDb();
        const user = await User.findOne({ email });
        if (!user || user.resetPasswordOtp !== otp) {
            return NextResponse.json({ message: "invalid reset code" }, { status: 400 });
        }
        if (!user.resetPasswordOtpExpiresAt || user.resetPasswordOtpExpiresAt.getTime() < Date.now()) {
            return NextResponse.json({ message: "reset code has expired" }, { status: 400 });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpiresAt = undefined;
        await user.save();
        return NextResponse.json({ message: "password reset successfully" });
    } catch (error) {
        return NextResponse.json({ message: `reset password error ${error}` }, { status: 500 });
    }
}