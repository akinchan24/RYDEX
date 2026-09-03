import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return Response.json({ message: "unauthorized" }
                , { status: 400 }
            )
        }

        await connectDb()
        const vehicleId=(await context.params).id
        const vehicle=await Vehicle.findById(vehicleId)

        if(!vehicle){
            return Response.json(
                {message:"vehicle not found"},
                {status:400}
            )
        }

        vehicle.status="approved"
        vehicle.rejectionReason=undefined
        await vehicle.save()

        const partner=await User.findById(vehicle.owner)
        if(!partner){
             return Response.json(
                {message:"partner not found"},
                {status:400}
            )
        }
        partner.partnerOnBoardingSteps=7
        await partner.save()
         return Response.json(
                vehicle,
                {status:200}
            )
    } catch (error) {
         return Response.json(
                {message:`vehicle approve error ${error}`},
                {status:500}
            )
    }
    
}