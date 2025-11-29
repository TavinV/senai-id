import express from 'express'
import validateSessionToken from '../middlewares/JWT_Auth.js'
import upload from '../middlewares/multer.js'
import { validarAluno, validarFuncionario } from '../middlewares/validatebody.js'
import {
    getUser,
    getUsers,
    getLoggedUser,
    getFotoPerfil,
    primeiroAcesso,
    acesso,
    pedirToken,
    validarToken,
    forgotPassword,
    resetPassword,
    setupPassword,
    pedirUpdate,
    buscarUpdates,
    buscarUpdate
} from '../controllers/user_controller.js'

import {
    registrarAluno,
    registrarFuncionario,
    atualizarUsuario,
    deletarUsuario
} from '../controllers/secretaria_controller.js'

const router = express.Router()

// --- Criação de usuários ---
router.post('/', validateSessionToken(true), upload.single("foto_perfil"), validarAluno, registrarAluno)
router.post('/employees', validateSessionToken(true), upload.single("foto_perfil"), validarFuncionario, registrarFuncionario)

// --- Ações do usuário ---
router.get('/first-access', primeiroAcesso)
router.get('/me/access', validateSessionToken(false), acesso)

// --- CRUD de usuários ---
router.get('/', validateSessionToken(true), getUsers)
router.get('/me', validateSessionToken(false), getLoggedUser)
router.get('/:id', getUser)
router.get('/:id/profile-picture', getFotoPerfil)
router.put('/:id', validateSessionToken(true), upload.single("foto_perfil"), atualizarUsuario)
router.delete('/:id', validateSessionToken(true), deletarUsuario)


// --- E-mail e senha ---
router.post('/:id/verify-email/request-token', pedirToken)
router.post('/:id/verify-email/validate-token', validarToken)
router.post('/forgot-password', forgotPassword)
router.put('/reset-password', resetPassword)
router.put('/:id/setup-password', setupPassword)

// --- Atualizações de perfil ---
router.post('/me/request-update', validateSessionToken(false), pedirUpdate)
router.get('/me/update-requests', validateSessionToken(false), buscarUpdates)
router.get('/me/update-requests/:id', validateSessionToken(false), buscarUpdate)

export default router
