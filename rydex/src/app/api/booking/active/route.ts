import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectDb()
        const session=await auth()
         if (!session?.user?.id) {
                    return NextResponse.json(
                        {booking:null },
                      
                    )
                }

          const user=await User.findOne({email:session.user.email})  
          
          const booking=await Booking.findOne({
            user:user._id,
            bookingStatus:{$in:["requested", "awaiting_payment", "confirmed", "started"]}
          })

          if(!booking){
            return NextResponse.json(
                       {booking:"idle"}
                    )
          }

 return NextResponse.json(
                       {booking}
                    )

    } catch (error) {
         return NextResponse.json(
                        { message: `get active booking error ${error}`},
                        { status: 400 }
                    )
    }
}