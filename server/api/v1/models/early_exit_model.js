import mongoose from "mongoose";

const earlyExitSchema = new mongoose.Schema(
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
        },
        responsavel: {
            type: String,
            required: true,
            default: "",
            sparse: true
        },
        horario_saida: {
            type: Date,
        },
        observacao: {
            type: String,
            required: true,
            default: "",
            sparse: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: "earlyExits"
    }
);

const EarlyExit = mongoose.model("EarlyExit", earlyExitSchema);
export default EarlyExit;