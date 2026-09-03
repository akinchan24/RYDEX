import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const {latitude,longitude,vehicleType}=await req.json()
        if(!Number.isFinite(latitude)||!Number.isFinite(longitude)){
            return NextResponse.json(
                {message:"coordinates not found"},
                {status:400}
            )
        }

        const partnerFilter = {
            role:"partner",
            isOnline:true,
            partnerStatus:"approved"
        }
        let partners=await User.find({
            ...partnerFilter,
            location:{
                $near:{
                    $geometry:{
                        type:"Point",
                        coordinates:[longitude,latitude]
                    },
                    $maxDistance:10000
                }
            }
        })

        if(partners.length===0){
            partners=await User.find({
                ...partnerFilter,
                location:{$exists:false}
            })
        }

        const partnerIds=partners.map(p=>p._id)

        if(partnerIds.length==0){
             return NextResponse.json(
                 [],
                {status:200}
            )
        }

        const vehicles=await Vehicle.find({
            owner:{$in:partnerIds},
            type:vehicleType,
            status:{$in:["approved","pending"]},
            isActive:true
        }).lean()

       return NextResponse.json(
                vehicles,
                {status:200}
            ) 


    } catch (error) {
        return NextResponse.json(
                {message:`near by vehicles error ${error}`},
                {status:500}
            )
    }
}
