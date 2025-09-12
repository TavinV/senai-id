import express from 'express'
const router = express.Router()

import sendMail from "../lib/Emails.js";
import ApiResponse from '../lib/ApiResponse.js'

import { support_email_notification_template } from '../templates/support_email_notification_template.js'

router.post("/send-message", async (req, res) => {
    const { nome, telefone, mensagem } = req.body

    if (!nome || !telefone || !mensagem) {
        return ApiResponse.BADREQUEST(res, "Todos os campos são obrigatórios.")
    }

    const emailHtml = support_email_notification_template(nome, telefone, mensagem)
    const [info, sendEmailError] = await sendMail("otavioviniciusads@gmail.com", `🔧 Suporte Senai ID `, emailHtml)

    if (!sendEmailError) {
        return ApiResponse.OK(res, null, "Mensagem enviada à equipe de suporte!")
    } else {
        return ApiResponse.ERROR(res, `Erro ao enviar email: ${sendEmailError}`)
    }

})

export default router