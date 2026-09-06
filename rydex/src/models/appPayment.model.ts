import mongoose from "mongoose";

export type AppPaymentStatus = "created" | "paid" | "failed";

export interface IAppPayment {
    partner: mongoose.Types.ObjectId
    amount: number
    orderId: string
    paymentId?: string
    status: AppPaymentStatus
    createdAt?: Date
    updatedAt?: Date
}

const appPaymentSchema = new mongoose.Schema<IAppPayment>({
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    paymentId: String,
    status: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created",
    },
}, { timestamps: true })

const AppPayment = mongoose.models.AppPayment || mongoose.model("AppPayment", appPaymentSchema)
export default AppPayment