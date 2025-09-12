import moment from "moment";

// Services
import { findUserById, findUserPFP, generateQRCODE, updateUser, findUserByEmail, findAllUsers } from "../services/user_services.js";
import { createToken, verifyToken, deleteToken } from "../services/email_token_services.js";
import { createUpdateRequest, findUpdateRequestById, findUpdateRequestsByUserId } from "../services/update_request_services.js";
import { createPasswordResetToken, deletePasswordResetToken, verifyPasswordResetToken } from "../services/password_reset_services.js";
import { createLateEntry, getLateEntries, getLateEntry } from "../services/late_entry_services.js";
import { getEarlyExit, getEarlyExitsByUser, requestEarlyExit } from "../services/early_exit_services.js";

//Lib
import sendMail from "../lib/Emails.js";
import ApiResponse from '../lib/ApiResponse.js'
import { minuteDiff } from "../lib/Horarios.js";
import { criarHash } from "../lib/Criptografar.js";

// Email Templates
import { email_verification_token_template } from "../templates/email_verification_token_template.js";
import { update_request_email_template } from "../templates/update_request_pending_template.js";
import { password_reset_token_template } from '../templates/password_reset_token_template.js';
import { late_entry_pending_email_template } from "../templates/late_entry_pending_template.js";
import { early_exit_pending_template } from "../templates/early_exit_pending_template.js";

// GET api/v1/users/:id
const getUser = async (req, res) => {
    const id = req.params.id

    const [user, error] = await findUserById(id)

    if (!user && error != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.

        return ApiResponse.ERROR(res, `Erro interno do servidor. ${error}`)
    } else if (error == 404) {
        // Usuário não encontrado.

        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    return ApiResponse.OK(res, user)
}

// GET api/v1/users/
const getUsers = async (req, res) => {
    const [users, error] = await findAllUsers()
    if (error) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor. ${error}`)
    }
    if (!users || users.length === 0) {
        // Nenhum usuário encontrado.
        return ApiResponse.NOTFOUND(res, "Nenhum usuário encontrado.")
    }
    // Retorna a lista de usuários
    return ApiResponse.OK(res, users)
}

// GET api/v1/users/:id/foto-perfil
const getFotoPerfil = async (req, res) => {
    const id = req.params.id

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    // Após buscar o usuário, vamos encontrar a sua foto de perfil

    const [filePath, error] = await findUserPFP(user)
    if (!filePath) {
        return ApiResponse.NOTFOUND(res, "Foto de perfil não encontrada.")
    } else {
        return res.sendFile(filePath)
    }
}


// GET api/v1/users/:id/primeiro-acesso
const primeiroAcesso = async (req, res) => {
    const id = req.params.id

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    return ApiResponse.OK(res, {
        nome: user.nome,
        login: user.login,
        senha: user.senha_padrao,
        cpf: user.cpf
    })
}


// GET api/v1/users/me/acesso
const acesso = async (req, res) => {
    const id = req.decoded.id
    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const qrCodeURL = generateQRCODE(user)
    return ApiResponse.OK(res, { url: qrCodeURL })

}

// POST api/v1/users/:id/verify-email/request-token
const pedirToken = async (req, res) => {
    const id = req.params.id
    const { email } = req.body

    if (!id) {
        return ApiResponse.BADREQUEST(res, "ID do usuário não foi fornecido")
    }
    if (!email) {
        return ApiResponse.BADREQUEST(res, "Email não foi fornecido")
    }

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    // Criando o código de verificação

    const [token, createTokenError] = await createToken(user.id, email)

    if (createTokenError) {
        return ApiResponse.ERROR(res, `Erro ao criar Código de verificação: ${createTokenError}`)
    }

    // Enviando o código por email

    const emailHtml = email_verification_token_template(email, token)
    const [info, sendEmailError] = await sendMail(email, `Seu código de verificação é: ${token}`, emailHtml)

    if (!sendEmailError) {
        return ApiResponse.OK(res, null, "Código de verificação enviado com sucesso.")
    } else {
        return ApiResponse.ERROR(res, `Erro ao enviar email: ${sendEmailError}`)
    }

}


// POST api/v1/users/:id/verify-email/validate-token
const validarToken = async (req, res) => {
    const id = req.params.id
    const { token } = req.body

    if (!token) {
        return ApiResponse.BADREQUEST(res, "Código de verificação não foi fornecido")
    }

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const [tokenData, findTokenError] = await verifyToken(token)

    if (!tokenData) {
        return ApiResponse.UNAUTHORIZED(res, "Código de verificação inválido ou expirado")
    }

    const time_diff = minuteDiff(new Date(), tokenData.expires)

    if (time_diff > 10) {
        deleteToken(tokenData.token)
        return ApiResponse.UNAUTHORIZED(res, "Código de verificação expirado")
    }

    const email = tokenData.email
    const [sucess, updateError] = await updateUser(id, { email: email })

    if (updateError) {
        return ApiResponse.ERROR(res, `Erro ao atualizar o usuário: ${updateError}`)
    }

    deleteToken(tokenData.token)
    return ApiResponse.OK(res, null, "Email verificado com sucesso.")

}

// POST api/v1/users/me/late-entries/request-delay
const pedirAtraso = async (req, res) => {
    const id = req.decoded.id
    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    // Verificando se o usuário já tem um atraso pendente
    const [lateEntries, getLateEntriesError] = await getLateEntries(user.id)
    if (getLateEntriesError) {
        return ApiResponse.ERROR(res, `Erro ao buscar atrasos pendentes: ${getLateEntriesError}`)
    }

    if (lateEntries.length > 0 && lateEntries.some(entry => entry.status === 'Pendente')) {
        return ApiResponse.ALREADYEXISTS(res, "Você já tem um atraso pendente. Regularize-o antes de solicitar outro.")
    }

    try {
        const [lateEntry, createLateEntryError] = await createLateEntry(user.id)

        if (createLateEntryError) {
            return ApiResponse.ERROR(res, `Erro ao registrar o atraso.`)
        }

        const emailHtml = late_entry_pending_email_template(user.nome, lateEntry.id)
        const [info, sendEmailError] = await sendMail(user.email, `Seu atraso foi registrado, compareca à secretaria!`, emailHtml)

        if (sendEmailError) {
            return ApiResponse.ERROR(res, `Erro ao enviar email: ${sendEmailError}`)
        }

        return ApiResponse.CREATED(res, { codigo_atraso: lateEntry.id }, "Atraso registrado com sucesso. Compareça à secretaria para mais informações.")


    } catch (e) {
        console.error(e)
        return ApiResponse.ERROR(res, `Erro ao registrar o atraso: ${e.message}`)
    }

}


// GET api/v1/users/me/late-entries
const buscarAtrasos = async (req, res) => {
    const id = req.decoded.id
    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor. ${error}`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const [atrasos, error] = await getLateEntries(user.id)

    return ApiResponse.OK(res, { atrasos })
}

// GET api/v1/users/me/late-entries/:id
const buscarAtraso = async (req, res) => {
    const user_id = req.decoded.id
    const lateEntryId = req.params.id

    if (!lateEntryId) {
        return ApiResponse.ERROR(res, "ID do atraso não foi fornecido.")
    }

    const [user, findUserError] = await findUserById(user_id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor. ${error}`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const [lateEntry, findLateEntryError] = await getLateEntry(lateEntryId)

    if (!lateEntry) {
        return ApiResponse.NOTFOUND(res, "Atraso não encontrado.")
    }

    if (lateEntry.user_id != user_id) {
        return ApiResponse.FORBIDDEN(res, "Você não tem permissão para vizualizar esse atraso.")
    }

    return ApiResponse.OK(res, { lateEntry })

}


// POST api/v1/users/me/request-update
const pedirUpdate = async (req, res) => {
    const id = req.decoded.id

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const email = user.email
    const { tel, message } = req.body

    if (!tel) {
        return ApiResponse.BADREQUEST(res, "Telefone não informado.")
    }
    if (!message) {
        return ApiResponse.BADREQUEST(res, "Mensagem não informada.")
    }

    const [updateRequest, generateUpdateRequestError] = await createUpdateRequest(user.id, tel, message, user.nome)

    if (generateUpdateRequestError) {
        return ApiResponse.ERROR(res, `Erro ao gerar pedido de atualização: ${generateUpdateRequestError}`)
    }

    const updateRequestId = updateRequest.request_id
    const updateRequestMessage = updateRequest.message

    // Enviando a confirmação por email

    const emailHtml = update_request_email_template(updateRequestId, updateRequestMessage, user.nome)
    const [info, sendEmailError] = await sendMail(email, `Seu pedido de correção de dados está em análise`, emailHtml)

    if (!sendEmailError) {
        return ApiResponse.OK(res, { numero_pedido: updateRequestId }, "Pedido de verificação criado com sucesso")
    } else {
        return ApiResponse.ERROR(res, `Erro ao enviar email: ${sendEmailError}`)
    }

}

// GET api/v1/users/me/update-requests
const buscarUpdates = async (req, res) => {
    const user_id = req.decoded.id
    const [user, findUserError] = await findUserById(user_id)
    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor. ${findUserError}`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }
    const [updateRequests, findUpdateRequestsError] = await findUpdateRequestsByUserId(user_id)
    if (findUpdateRequestsError) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor. ${findUpdateRequestsError}`)
    }

    return ApiResponse.OK(res, { updateRequests })
}

//GET api/v1/users/me/update-requests/:id
const buscarUpdate = async (req, res) => {
    const user_id = req.decoded.id
    const request_id = req.params.id
    if (!request_id) {
        return ApiResponse.BADREQUEST(res, "ID do pedido de atualização não foi fornecido.")
    }
    const [user, findUserError] = await findUserById(user_id)
    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor. ${findUserError}`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }
    const [updateRequest, findUpdateRequestError] = await findUpdateRequestById(request_id)

    if (!updateRequest) {
        return ApiResponse.NOTFOUND(res, "Pedido de atualização não encontrado.")
    }
    return ApiResponse.OK(res, { updateRequest })
}

// POST api/v1/users/forgot-password?email=
const forgotPassword = async (req, res) => {
    const email = req.query.email || ""

    if (email == "") {
        return ApiResponse.BADREQUEST(res, "Usuário não tem um email verificado.")
    }

    const [user, findUserError] = await findUserByEmail(email)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor. ${error}`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const [tokenCode, createPasswordResetTokenError] = await createPasswordResetToken(user.id)

    if (!tokenCode) {
        return ApiResponse.ERROR(res, `Erro ao criar token de recuperação de senha.`)
    }

    // Enviando o email para o usuário

    const emailHtml = password_reset_token_template(tokenCode)
    const [info, sendEmailError] = await sendMail(email, `Redefina a sua senha`, emailHtml)

    if (!sendEmailError) {
        return ApiResponse.OK(res, null, "Codigo de recuperação de senha enviado com sucesso")
    } else {
        return ApiResponse.ERROR(res, `Erro ao enviar email: ${sendEmailError}`)
    }

}

// POST api/v1/users/reset-password?token=
const resetPassword = async (req, res) => {
    const token = req.query.token
    const { senha, confirmarSenha } = req.body

    const [tokenData, findTokenError] = await verifyPasswordResetToken(token)

    if (!tokenData) {
        return ApiResponse.UNAUTHORIZED(res, "Código de verificação inválido")
    }

    const time_diff = minuteDiff(new Date(), tokenData.expires)

    if (time_diff > 10) {
        deletePasswordResetToken(tokenData.token)
        return ApiResponse.UNAUTHORIZED(res, "Código de verificação expirado")
    }

    if (!senha || !confirmarSenha) {
        return ApiResponse.BADREQUEST(res, "Preencha todos os campos")
    }

    if (senha != confirmarSenha) {
        return ApiResponse.BADREQUEST(res, "As senhas não coincidem.")
    }

    // Atualizar a senha do usuário, criptografando.

    const id = tokenData.user_id

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const salt = user.salt
    const senhaCriptografada = criarHash(confirmarSenha, salt)

    const [updated, updateUserError] = await updateUser(id, { senha: senhaCriptografada })

    if (!updated) {
        return ApiResponse.ERROR(res, `Erro ao atualizar senha`)
    }

    deletePasswordResetToken(tokenData.token)
    return ApiResponse.OK(res, "Senha atualizada com sucesso")

}


// POST api/v1/users/:id/setup-password
const setupPassword = async (req, res) => {
    const id = req.params.id
    const { cpf, senha, confirmarSenha } = req.body

    if (!cpf || !senha || !confirmarSenha) {
        return ApiResponse.BADREQUEST(res, "Preencha todos os campos")
    }

    if (id == "") {
        return ApiResponse.BADREQUEST(res, "ID é obrigatório.")
    }

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor`)

    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    // Verificando se o CPF cadastrado e o fornecido coincidem

    if (user.cpf !== cpf) {
        return ApiResponse.BADREQUEST(res, "CPF não coincide com o cadastro.")
    }

    // Verificando se é o primeiro acesso do usuário

    if (user.senha_foi_alterada) {
        return ApiResponse.BADREQUEST(res, "Senha já foi alterada")
    }

    // Verificando se as senhas coincidem

    if (senha !== confirmarSenha) {
        return ApiResponse.BADREQUEST(res, "Senhas não coincidem.")
    }

    // Criptografando a senha

    const salt = user.salt
    const senhaCriptografada = criarHash(confirmarSenha, salt)

    const [updated, updateUserError] = await updateUser(id, { senha: senhaCriptografada, senha_foi_alterada: true })

    if (!updated) {
        return ApiResponse.ERROR(res, `Erro ao atualizar senha`)
    }

    return ApiResponse.OK(res, "Senha atualizada com sucesso")

}

// POST api/v1/users/me/early-exits/request
const pedirSaidaAntecipada = async (req, res) => {
    const { motivo, horario_saida } = req.body;
    const user_id = req.decoded.id;
    const [user, findUserError] = await findUserById(user_id)

    if (!user && findUserError != 404) {
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }


    if (!motivo || motivo.trim() === "" || !horario_saida) {
        return ApiResponse.BADREQUEST(res, "Motivo e horário de saída são obrigatórios.");
    }

    // Cria o Date com hoje + horário fornecido
    const saidaDate = new Date(new Date().setHours(...horario_saida.split(':').map(Number), 0, 0));


    // Verificando se o usuário já tem um atraso pendente
    const [earlyExits, getEarlyExitsError] = await getEarlyExitsByUser(user_id);
    if (getEarlyExitsError) {
        return ApiResponse.ERROR(res, `Erro ao buscar pedidos de liberação pendentes: ${getLateEntriesError}`)
    }

    const [earlyExit, createEarlyExitError] = await requestEarlyExit(user_id, motivo, saidaDate);
    if (createEarlyExitError) {
        return ApiResponse.ERROR(res, `Erro ao requerer pedido de liberação: ${createEarlyExitError}`);
    }


    if (earlyExits.length > 0 && earlyExits.some(entry => entry.status === 'Pendente')) {
        console.log(earlyExits)
        return ApiResponse.ERROR(res, "Você já tem um pedido de liberação em análise. Espere a resposta antes de solicitar outro.")
    }

    // Envia o email de confirmação
    const emailHtml = early_exit_pending_template(earlyExit.id, user.nome, earlyExit.motivo);
    const [info, sendEmailError] = await sendMail(user.email, `Seu pedido de liberação foi feito`, emailHtml);

    if (sendEmailError) {
        return ApiResponse.ERROR(res, `Erro ao enviar email: ${sendEmailError}`);
    }

    return ApiResponse.OK(res, earlyExit, "Pedido de liberação solicitado com sucesso.");
};

// GET api/v1/users/me/early-exits
const buscarSaidasAntecipadas = async (req, res) => {
    const user_id = req.decoded.id;
    const [user, findUserError] = await findUserById(user_id)

    if (!user && findUserError != 404) {
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const [earlyExits, getEarlyExitsError] = await getEarlyExitsByUser(user_id);
    if (getEarlyExitsError) {
        return ApiResponse.ERROR(res, `Erro ao buscar pedidos de liberação: ${getEarlyExitsError}`);
    }

    return ApiResponse.OK(res, { earlyExits });
};

// GET api/v1/users/me/early-exits/:id
const buscarSaidaAntecipada = async (req, res) => {
    const user_id = req.decoded.id;
    const early_exit_id = req.params.id;

    if (!early_exit_id) {
        return ApiResponse.BADREQUEST(res, "ID da liberação não foi fornecido.");
    }

    const [user, findUserError] = await findUserById(user_id)

    if (!user && findUserError != 404) {
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const [earlyExit, getEarlyExitError] = await getEarlyExit(early_exit_id);

    if (!earlyExit && getEarlyExitError == 404) {
        return ApiResponse.NOTFOUND(res, `Pedido de liberação: ${early_exit_id} não encontrado.`);
    } else if (getEarlyExitError) {
        return ApiResponse.ERROR(res, `Erro ao buscar o pedido liberação: ${getEarlyExitError}`);
    }

    if (earlyExit.user_id !== user_id) {
        return ApiResponse.FORBIDDEN(res, "Você não tem permissão para visualizar este pedido de liberação.");
    }

    return ApiResponse.OK(res, { earlyExit });
}

export {
    getUser,
    getUsers,
    getFotoPerfil,
    primeiroAcesso,
    acesso,
    pedirToken,
    validarToken,
    pedirUpdate,
    buscarUpdate,
    buscarUpdates,
    forgotPassword,
    resetPassword,
    setupPassword,
    buscarAtrasos,
    buscarAtraso,
    pedirAtraso,
    pedirSaidaAntecipada,
    buscarSaidasAntecipadas,
    buscarSaidaAntecipada
}