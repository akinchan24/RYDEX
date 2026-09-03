import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config()
const port = process.env.PORT || 5000
const mongodbUrl=process.env.MONGODB_URL
import http from "http"
import { Server } from "socket.io"
import User from "./models/user.model.js"
const connectDb=async () => {
    try {
        await mongoose.connect(mongodbUrl)
        console.log("db connected")
    } catch (error) {
        console.log("db error")
    }
}

const app=express()
app.use(express.json())
const server=http.createServer(app)

const io=new Server(server,{
    cors:{
        origin:process.env.NEXT_BASE_URL
    }
})


app.post("/emit",async (req,res)=>{
const {event,userId,data}=req.body
try {
    const user=await User.findById(userId)
    if(user.socketId){
io.to(user.socketId).emit(event,data)
    }
    
    return res.json({success:true})
} catch (error) {
    return res.json({success:false})
}
})

io.on("connection",(socket)=>{
  
   socket.on("identity",async (userId)=>{
      socket.userId=userId
      await User.findByIdAndUpdate(userId,{
        socketId:socket.id,
        isOnline:true
      })

   })


   socket.on("update-location",async ({userId,latitude,longitude})=>{
    await User.findByIdAndUpdate(userId,{
        location:{
            type:"Point",
            coordinates:[longitude,latitude]
        },
        isOnline:true
    })
   })

   socket.on("join-ride",(bookingId)=>{
    console.log("join ride",bookingId)
    socket.join(`ride-${bookingId}`)
   })

   socket.on("driver-location-update",({bookingId,latitude,longitude,status})=>{
    io.to(`ride-${bookingId}`).emit("driver-location",{
        latitude,
        longitude
    })
   })

   socket.on("chat-message",(data)=>{
    io.to(`ride-${data.bookingId}`).emit("chat-message",data)
   })


   socket.on("disconnect",async ()=>{
    if(!socket.userId)return;
const user=await User.findById(socket.userId).select("socketId")
if(user?.socketId===socket.id){
 await User.findByIdAndUpdate(socket.userId,{
                    socketId:null,
                    isOnline:false
                })
}
   })

})




server.listen(port,()=>{
    console.log("server started")
    connectDb()
})
