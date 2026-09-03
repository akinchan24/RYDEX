import connectDb from "@/lib/db";
import ChatMessage from "@/models/chatMessage.model";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const geminiUrl=process.env.GEMINI_API_URL!

export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const {lastMessage,role}=await req.json()
    
        const prompt=`You are an AI reply suggestion system for a vehicle booking chat app.

Generate short, smart, human-like quick reply suggestions based on:
- ROLE (DRIVER or USER)
- RECENT_MESSAGE

Rules:
- Return exactly 3 suggestions
- Keep replies short (3–12 words)
- Match the conversation context and tone
- Driver replies should sound professional and helpful
- User replies should sound natural and realistic
- Avoid repetition
- Return ONLY valid JSON

Output format:
{
  "suggestions": [
    "Reply 1",
    "Reply 2",
    "Reply 3"
  ]
}

Input:
ROLE:${role}
RECENT_MESSAGE: ${lastMessage}`

        const response=await axios.post(geminiUrl,{
    "contents": [
      {
        "parts": [
          {
            "text": `${prompt}`
          }
        ]
      }
    ]
  })

  const suggestions=response.data.candidates[0].content.parts[0].text

   return NextResponse.json(
            suggestions,
            {status:200}
        )
       
    } catch (error) {
        console.log(error)
          return NextResponse.json(
            {message:`get ai suggestions  error ${error}`},
            {status:500}
        )
    }
}