import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import axios from "axios";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "unauthorize" },
                { status: 400 }
            )
        }

        const {
            driverId,
            vehicleId,
            pickUpAddress,
            dropAddress,
            pickUpLocation,
            dropLocation,
            fare,
            mobileNumber,
        } = await req.json()


        if (!driverId || !vehicleId || !pickUpLocation.coordinates || !dropLocation.coordinates) {
            return NextResponse.json(
                { message: "missing required details" },
                { status: 400 }
            )
        }
 const user=await User.findOne({email:session.user.email})
        const driver = await User.findById(driverId)
        if (!driver) {
            return NextResponse.json(
                { message: "driver not found" },
                { status: 400 }
            )
        }

        const existing = await Booking.findOne({
            user: user._id,
            bookingStatus: {
                $in: ["requested", "awaiting_payment", "confirmed", "started"]
            }
        })
        console.log(existing)

        if (existing) {
            return NextResponse.json(
                existing
            )
        }

        const booking = await Booking.create({
            user:  user._id,
            driver,
            vehicle: vehicleId,
            pickUpAddress,
            dropAddress,

            pickUpLocation,
            dropLocation,

            fare,

            userMobileNumber: mobileNumber,
            driverMobileNumber: driver.mobileNumber,

            bookingStatus: "requested"
        })

        await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/emit`,{
           event:"new-booking",
           userId:driverId,
           data:booking
        })


 return NextResponse.json(
                booking,{status:200}
            )


    } catch (error) {
 return NextResponse.json(
               {message:`create booking error ${error}`},
               {status:500}
            )
    }
}