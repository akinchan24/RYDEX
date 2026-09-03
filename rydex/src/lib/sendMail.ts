import nodemailer  from "nodemailer"
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASS
    }
})

export const sendMail=async (to:string,subject:string,html:string)=>{
return transporter.sendMail({
    from:`"RYDEX" <${process.env.EMAIL}>`,
    to,
    subject,
    html
})
}