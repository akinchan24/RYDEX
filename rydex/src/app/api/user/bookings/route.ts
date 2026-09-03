import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectDb()
         const session = await auth()
                if (!session || !session.user?.email) {
                    return NextResponse.json({ message: "unauthorized" }
                        , { status: 400 }
                    )
                }

                const user=await User.findOne({email:session.user.email})

          const bookings=await Booking.find({user:user._id}).populate("user driver vehicle")
          .sort({createdAt:-1}) 
          
          
          return NextResponse.json(
            bookings,
            {status:200}
          )
    } catch (error) {
        return NextResponse.json({ message: `get bookings for partner error ${error}`}
                        , { status: 400 }
                    )
    }
}