import mongoose from "mongoose"

export interface IPartnerDocs{
    owner:mongoose.Types.ObjectId
    aadharUrl:string,
    rcUrl:string,
    licenseUrl:string
    status:"approved" | "pending" | "rejected",
    rejectionReason?:string,
    createdAt:Date,
    updatedAt:Date

}


const partnerDocsSchema=new mongoose.Schema<IPartnerDocs>({

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    aadharUrl:String,
    rcUrl:String,
    licenseUrl:String,
   
   status:{
    type:String,
    enum:["approved","rejected","pending"],
    default:"pending"
   },
    rejectionReason:String,
    

},{timestamps:true})

const PartnerDocs=mongoose.models.PartnerDocs || mongoose.model("PartnerDocs",partnerDocsSchema)
export default PartnerDocs

