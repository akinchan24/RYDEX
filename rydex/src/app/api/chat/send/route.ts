import connectDb from "@/lib/db";
import ChatMessage from "@/models/chatMessage.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const {bookingId,sender,text}=await req.json()
        const msg=await ChatMessage.create({
            bookingId,sender,text
        })
        return NextResponse.json(
            msg,
            {status:200}
        )
    } catch (error) {
        console.log(error)
          return NextResponse.json(
            {message:`send message error ${error}`},
            {status:500}
        )
    }
}