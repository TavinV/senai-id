import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const router = express.Router()

// Caminho absoluto para a pasta de logs
const logsFolder = path.resolve(__dirname, '../../../logs') // Subindo dois níveis para acessar 'logs'
const infoLog = path.join(logsFolder, 'info.log')
const exceptionLog = path.join(logsFolder, 'exception.log')
const rejectionLog = path.join(logsFolder, 'rejection.log')

// Rota para enviar o arquivo info.log
router.get('/info', (req, res) => {
    res.sendFile(infoLog, (err) => {
        if (err) {
            res.status(500).json({ error: "Erro ao enviar o arquivo.", err })
        }
    })
})

// Rota para enviar o arquivo exception.log
router.get('/exception', (req, res) => {
    res.sendFile(exceptionLog, (err) => {
        if (err) {
            res.status(500).json({ error: "Erro ao enviar o arquivo.", err })
        }
    })
})

// Rota para enviar o arquivo rejection.log
router.get('/rejection', (req, res) => {
    res.sendFile(rejectionLog, (err) => {
        if (err) {
            res.status(500).json({ error: "Erro ao enviar o arquivo.", err })
        }
    })
})

export default router
