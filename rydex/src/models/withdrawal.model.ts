import mongoose from "mongoose";

export type WithdrawalStatus = "pending" | "paid" | "rejected";

export interface IWithdrawal {
    partner: mongoose.Types.ObjectId
    amount: number
    bank: mongoose.Types.ObjectId
    status: WithdrawalStatus
    createdAt?: Date
    updatedAt?: Date
}

const withdrawalSchema = new mongoose.Schema<IWithdrawal>({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 1 },
    bank: { type: mongoose.Schema.Types.ObjectId, ref: "PartnerBank", required: true },
    status: { type: String, enum: ["pending", "paid", "rejected"], default: "pending" },
}, { timestamps: true })

const Withdrawal = mongoose.models.Withdrawal || mongoose.model("Withdrawal", withdrawalSchema)
export default Withdrawal