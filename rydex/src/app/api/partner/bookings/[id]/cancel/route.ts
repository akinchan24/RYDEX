import { auth } from "@/auth"
import connectDb from "@/lib/db"
import Booking from "@/models/booking.model"
import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 })
    }

    await connectDb()
    const driver = await Booking.findOne({ _id: (await context.params).id })
      .populate("driver", "email")

    if (!driver || driver.driver?.email !== session.user.email) {
      return NextResponse.json({ message: "booking not found" }, { status: 404 })
    }

    if (!["requested", "awaiting_payment", "confirmed"].includes(driver.bookingStatus)) {
      return NextResponse.json({ message: "ride cannot be cancelled now" }, { status: 400 })
    }

    driver.bookingStatus = "cancelled"
    await driver.save()

    await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/emit`, {
      event: "cancel-booking",
      userId: driver.user,
      data: driver.bookingStatus
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("partner cancel booking error", error)
    return NextResponse.json({ message: "cancel booking error" }, { status: 500 })
  }
}
