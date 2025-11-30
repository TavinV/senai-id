import express from 'express'
import validateSessionToken from '../middlewares/JWT_Auth.js'
import {
    buscarAtraso,
    buscarAtrasos,
    pedirAtraso
} from '../controllers/user_controller.js'

import {
    atrasoPorCodigo,
    atrasosDeTodosAlunos,
    validarAtraso,
    deletarAtraso
} from '../controllers/secretaria_controller.js'

const router = express.Router()

// Aluno
router.get('/me', validateSessionToken(false), buscarAtrasos)
router.get('/me/:id', validateSessionToken(false), buscarAtraso)
router.post('/me/request', validateSessionToken(false), pedirAtraso)

// Secretaria
router.get('/', validateSessionToken(true), atrasosDeTodosAlunos)
router.get('/:id', validateSessionToken(true), atrasoPorCodigo)
router.put('/:id/validate', validateSessionToken(true), validarAtraso)
router.delete('/:id', validateSessionToken(true), deletarAtraso)

export default router
