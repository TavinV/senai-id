import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        },
        expires: {
            type: Date,
            required: true
        }
    },
    {
        collection: "passwordResetTokens"
    }
)

const PasswordResetToken = mongoose.model("PasswordResetToken", tokenSchema)

export default PasswordResetToken