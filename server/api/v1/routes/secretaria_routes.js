import express from 'express'
import validateSessionToken from '../middlewares/JWT_Auth.js'
import upload from '../middlewares/multer.js'
import { validarAluno, validarFuncionario } from '../middlewares/validatebody.js'

import { deletarUsuario, registrarAluno, registrarFuncionario, atualizarUsuario, aprovarPedido, rejeitarPedido, validarAtraso, atrasosDeUmAluno, deletarAtraso, validarSaidaAntecipada, negarSaidaAntecipada, deletarSaidaAntecipada, atrasosDeTodosAlunos, saidasAntecipadasDeTodosAlunos, pedidosDeAtualizacao } from '../controllers/secretaria_controller.js'

const router = express.Router()

router.get('/late-entries/:id', validateSessionToken(true), atrasosDeUmAluno)
router.get('/late-entries', validateSessionToken(true), atrasosDeTodosAlunos)
router.get('/early-exits', validateSessionToken(true), saidasAntecipadasDeTodosAlunos)
router.get('/update-requests', validateSessionToken(true), pedidosDeAtualizacao)

router.post('/register/student', validateSessionToken(true), upload.single("foto_perfil"), validarAluno, registrarAluno)
router.post('/register/employee', validateSessionToken(true), upload.single("foto_perfil"), validarFuncionario, registrarFuncionario)

router.put('/late-entries/:id/validate', validateSessionToken(true), validarAtraso)

router.delete('/:id', validateSessionToken(true), deletarUsuario)
router.delete('/late-entries/:id', validateSessionToken(true), deletarAtraso)
router.delete('/early-exits/:id', validateSessionToken(true), deletarSaidaAntecipada)

router.put('/update-requests/:id/approve', validateSessionToken(true), aprovarPedido)
router.put('/update-requests/:id/deny', validateSessionToken(true), rejeitarPedido)
router.put('/users/:id', validateSessionToken(true), atualizarUsuario)
router.put('/early-exits/:id/allow', validateSessionToken(true), validarSaidaAntecipada)
router.put('/early-exits/:id/deny', validateSessionToken(true), negarSaidaAntecipada)

export default router