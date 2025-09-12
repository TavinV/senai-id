import mongoose from "mongoose";

const lateEntrySchema = mongoose.Schema(
    {
        id: {
            type: String,
            required: true
        },
        user_id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: "Pendente"
        },
        motivo: {
            type: String,
            required: true,
            default: "",
            sparse: true
        },
        responsavel: {
            type: String,
            required: true,
            default: "",
            sparse: true
        },
        observacao: {
            type: String,
            required: true,
            default: "",
            sparse: true
        },
    },
    {
        timestamps: true,
        collection: "lateEntries"
    }
)

const lateEntry = mongoose.model("lateEntry", lateEntrySchema)

export default lateEntry