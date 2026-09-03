import { auth } from "@/auth"
import connectDb from "@/lib/db"
import User from "@/models/user.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 })
    }

    const { latitude, longitude } = await req.json()
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return NextResponse.json({ message: "invalid coordinates" }, { status: 400 })
    }

    await connectDb()
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        isOnline: true
      },
      { new: true, select: "_id" }
    )

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("location update error", error)
    return NextResponse.json({ message: "location update failed" }, { status: 500 })
  }
}
