import mongoose, { Document, Mongoose } from "mongoose";



const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
   type:String,
    required:true,
    unique:true 
},
password:{
    type:String,
},
role:{
    type:String,
    default:"user",
    enum:["user","partner","admin"]
},
isEmailVerified:{
    type:Boolean,
    default:false
},
partnerOnBoardingSteps:{
    type:Number,
    min:0,
    max:8,
    default:0
},
mobileNumber:{
type:String
},
partnerStatus:{
type:String,
enum:["pending","approved","rejected"],
default:"pending"
},
rejectionReason:{
type:String
},
videoKycStatus:{
    type:String,
    enum:[  "not_required" , "pending","in_progress", "approved", "rejected"],
    default:"not_required"
},
videoKycRoomId:{
     type:String
},
videoKycRejectionReason:{
    type:String
},
otp:{
    type:String
},
otpExpiresAt:{
    type:Date
},
socketId:{
    type:String,
    default:null
},
location:{
    type:{
        type:String,
        enum:["Point"]
    },
    coordinates:[Number]
}
,
isOnline:{
    type:Boolean,
    default:false,
    index:true
}

},{timestamps:true})

userSchema.index({location:"2dsphere"})

const User= mongoose.model("User",userSchema)
export default User