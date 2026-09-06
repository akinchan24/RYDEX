import connectDb from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const {bookingId,otp}=await req.json()
        const booking=await Booking.findById(bookingId).populate("user")
        if(!booking){
            return NextResponse.json(
                {message:"booking not found"},
                {status:400}
            )
        }

        if(!booking.dropOtp){
             return NextResponse.json(
                {message:"drop otp not generated"},
                {status:400}
            ) 
        }
         if(booking.dropOtp!=otp){
             return NextResponse.json(
                {message:"incorrect drop otp"},
                {status:400}
            ) 
        }
         if(booking.dropOtpExpires<new Date()){
             return NextResponse.json(
                {message:"otp expired"},
                {status:400}
            ) 
        }

        if (booking.bookingStatus === "completed") {
            return NextResponse.json(
                {message:"ride is already completed"},
                {status:400}
            )
        }

        if(booking.paymentMethod === "cash" || booking.paymentStatus === "cash"){
            const adminCommission=Number((booking.fare*0.10).toFixed(2))
            const partnerAmount=Number((booking.fare-adminCommission).toFixed(2))
            booking.adminCommission=adminCommission
            booking.partnerAmount=partnerAmount
            await User.findByIdAndUpdate(booking.driver, {
                $inc: {
                    pendingAppPayment: adminCommission,
                    totalAppCommission: adminCommission,
                },
            })
        }
       booking.paymentStatus="paid"
        booking.bookingStatus="completed"
        booking.dropOtp=""
        booking.dropOtpExpires=undefined
        await booking.save()

        

        return NextResponse.json(
            {message:"drop otp verified"},
            {status:200}
        )
    } catch (error) {
         return NextResponse.json(
            {message:"drop otp verify error"},
            {status:500}
        )
    }
}