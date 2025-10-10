import express from 'express'
import validateSessionToken from '../middlewares/JWT_Auth.js'

import {
    // Secretaria/Admin
    pedidosDeAtualizacao,
    aprovarPedido,
    rejeitarPedido
} from '../controllers/secretaria_controller.js'

import {
    pedirUpdate,
    buscarUpdate,
    buscarUpdates
} from '../controllers/user_controller.js'

const router = express.Router()

// === USUÁRIO ===
// Criar solicitação de atualização
router.post('/', validateSessionToken(false), pedirUpdate)

// Listar solicitações do próprio usuário
router.get('/me', validateSessionToken(false), buscarUpdates)

// Ver uma solicitação específica do próprio usuário
router.get('/:id', validateSessionToken(false), buscarUpdate)


// === ADMIN / SECRETARIA ===
router.get('/', validateSessionToken(true), pedidosDeAtualizacao)
router.put('/:id/approve', validateSessionToken(true), aprovarPedido)
router.put('/:id/deny', validateSessionToken(true), rejeitarPedido)

export default router
