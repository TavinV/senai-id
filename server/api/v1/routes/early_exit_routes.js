import express from 'express'
import validateSessionToken from '../middlewares/JWT_Auth.js'

import {
    buscarSaidasAntecipadas,
    buscarSaidaAntecipada,
    pedirSaidaAntecipada
} from '../controllers/user_controller.js'

import {
    saidasAntecipadasDeTodosAlunos,
    validarSaidaAntecipada,
    negarSaidaAntecipada,
    deletarSaidaAntecipada,
    saidaAntecipadaPorId
} from '../controllers/secretaria_controller.js'

const router = express.Router()

// Aluno
router.get('/me', validateSessionToken(false), buscarSaidasAntecipadas)
router.get('/me/:id', validateSessionToken(false), buscarSaidaAntecipada)
router.post('/me/request', validateSessionToken(false), pedirSaidaAntecipada)

// Secretaria
router.get('/', validateSessionToken(true), saidasAntecipadasDeTodosAlunos)
router.get('/:id', validateSessionToken(true), saidaAntecipadaPorId)
router.put('/:id/allow', validateSessionToken(true), validarSaidaAntecipada)
router.put('/:id/deny', validateSessionToken(true), negarSaidaAntecipada)
router.delete('/:id', validateSessionToken(true), deletarSaidaAntecipada)

export default router
