import app from './app.js';
import connectDB from "./lib/MongoDB_Connection.js";
import initJobs from './job_runner.js';
import logger from './lib/logger.js';

const port = 3000

// Iniciando o servidor
connectDB().then(async () => {

    app.listen(port, () => {
        console.log(`Servidor ativo na porta ${port}`)
        initJobs()
    })

}).catch((erro_conexao) => {
    console.log("Conexão com o banco de dados falhou.")
    console.log(erro_conexao)
})