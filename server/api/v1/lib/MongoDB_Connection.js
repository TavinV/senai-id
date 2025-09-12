import mongoose from "mongoose";
import logger from './logger.js';

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_CONNECTION;
        await mongoose.connect(uri, { dbName: "senaiid_db" });

    } catch (err) {
        logger.error("Conexão com banco de dados falhou", { err })
        process.exit(1); // Finaliza o processo em caso de erro
    }
};

export default connectDB;