import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        const adminUser = session?.user?.email
            ? await User.findOne({ email: session.user.email }).select("role")
            : null
        if (!adminUser || adminUser.role !== "admin") {
            return Response.json({ message: "unauthorized" }
                , { status: 400 }
            )
        }
        const totalPartners = await User.countDocuments({ role: "partner" })
        const totalApprovedPartners = await User.countDocuments({ role: "partner", partnerStatus: "approved" })
        const totalPendingPartners = await User.countDocuments({ role: "partner", partnerStatus: "pending" })
        const totalRejectedPartners = await User.countDocuments({ role: "partner", partnerStatus: "rejected" })

        const pendingDocs = await PartnerDocs.find({ status: "pending" }).select("owner")
        const pendingPartnerUsers = await User.find({
            _id: { $in: pendingDocs.map((document) => document.owner) },
            role: "partner",
            partnerStatus: "pending"
        })
        console.log(pendingPartnerUsers)
        const partnerIds = pendingPartnerUsers.map((p) => p._id)
        const partnerVehicles = await Vehicle.find({
            owner: { $in: partnerIds }
        })
        const vehicleTypeMap = new Map(
            partnerVehicles.map((v) => [String(v.owner), v.type])
        )

        const pendingPartnersReviews = pendingPartnerUsers.map((p) => ({
            _id: p._id,
            name: p.name,
            email: p.email,
            vehicleType: vehicleTypeMap.get(String(p._id))
        }))


        const pendingVehicles=await Vehicle.find({
            status:"pending",
            baseFare:{$exists:true},
             pricePerKM:{$exists:true}
        }).populate("owner")



        return NextResponse.json({
            pendingVehicles,
            stats:{ 
                totalPartners,
            totalApprovedPartners,
            totalPendingPartners,
            totalRejectedPartners
        },
            pendingPartnersReviews
        }, {
            status: 200
        })

    } catch (error) {
        return NextResponse.json({
            message: `admin dashboard error ${error}`
        }, {
            status: 500
        })
    }
}