import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";

export async function GET(req:Request) {
    try {
        await connectDb()
        const session=await auth()
        if(!session || !session.user){
            return Response.json(
                {message:"user is not authenticated"},
                {status:400}
            )
        }
        const user=await User.findOne({email:session.user.email})
        if(!user){
             return Response.json(
                {message:"user not found!"},
                {status:400}
            )
        }

         return Response.json(
                user,
                {status:200}
            )
    } catch (error) {
         return Response.json(
                {message:`get me error ${error}`},
                {status:500}
            )
    }
}