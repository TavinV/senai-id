// Services
import { findUserById, updateUser, createUser, deleteUser, findUserPFP } from "../services/user_services.js";
import { findUpdateRequestById, acceptUpdateRequest, denyUpdateRequest, findAllUpdateRequests } from "../services/update_request_services.js";
import { validateLateEntry, getLateEntries, getLateEntry, deleteLateEntry, getAllLateEntries } from "../services/late_entry_services.js";
import { getEarlyExit, deleteEarlyExit, allowEarlyExit, denyEarlyExit, getAllEarlyExits } from "../services/early_exit_services.js";

//Lib
import sendMail from "../lib/Emails.js";
import ApiResponse from '../lib/ApiResponse.js';
import { cripografarSenhaUsuario } from "../lib/Criptografar.js";
import fs from 'fs'
import moment from "moment-timezone";
import logger from "../lib/logger.js";

// Schemas
import { alunoUpdateSchema, funcionarioUpdateSchema } from '../validation/user_schemas.js';

// Templates
import { approved_request_email_template } from "../templates/update_request_approved_template.js";
import { rejected_request_email_template } from "../templates/update_request_denied.js";
import { late_entry_approved_email_template } from "../templates/late_entry_validated_template.js";
import { early_exit_rejected_template } from "../templates/early_exit_rejected_template.js";
import { early_exit_approved_template } from "../templates/early_exit_approved_template.js";

// POST api/v1/secretaria/register/student
const registrarAluno = async (req, res) => {
    let usuario = req.body;

    // Verifica se o arquivo foi enviado
    if (!req.file) {
        return ApiResponse.BADREQUEST(res, "Nenhuma imagem foi enviada ou houve um erro no upload");
    }

    usuario.id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    usuario.senha_foi_alterada = false;
    usuario.email = usuario.email || '';
    usuario.cargo = "aluno";
    usuario.foto_perfil = req.file.path; // Caminho relativo para acessar a imagem

    usuario = cripografarSenhaUsuario(usuario);

    try {
        const [novoAluno, error] = await createUser(usuario);

        if (error === 409) {
            // Remove a imagem se o usuário já existir
            fs.unlinkSync(req.file.path);
            return ApiResponse.ALREADYEXISTS(res, "Este aluno já está cadastrado!");
        } else if (error === 500) {
            // Remove a imagem se houver erro no cadastro
            fs.unlinkSync(req.file.path);
            return ApiResponse.ERROR(res, "Erro ao cadastrar o aluno");
        }

        return ApiResponse.CREATED(res, {
            id_aluno: novoAluno.id,
            foto_perfil: novoAluno.foto_perfil
        }, `Aluno ${novoAluno.nome} criado com sucesso!`);

    } catch (error) {
        // Remove a imagem se houver qualquer erro não tratado
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return ApiResponse.ERROR(res, "Erro ao cadastrar o aluno", error);
    }
};

// POST api/v1/secretaria/register/employee
const registrarFuncionario = async (req, res) => {
    // 1. Verificação obrigatória da foto
    if (!req.file) {
        return ApiResponse.BADREQUEST(res, "Foto de perfil é obrigatória para cadastro de funcionário");
    }

    let usuario = req.body;

    // 2. Validação adicional do arquivo de imagem
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
        fs.unlinkSync(req.file.path); // Remove arquivo inválido
        return ApiResponse.BADREQUEST(res, "Formato de imagem inválido. Use JPEG, PNG ou GIF");
    }

    // 3. Preparação dos dados do usuário
    usuario.cargo = "funcionario";
    usuario.id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    usuario.senha_foi_alterada = false;
    usuario.email = usuario.email || '';
    usuario.foto_perfil = req.file.path; // Caminho obrigatório

    usuario = cripografarSenhaUsuario(usuario);

    try {
        const [novoFuncionario, error] = await createUser(usuario);

        // 4. Tratamento de erros com rollback da imagem
        if (error === 409) {
            fs.unlinkSync(req.file.path);
            return ApiResponse.ALREADYEXISTS(res, "Este funcionário já está cadastrado!");
        }
        else if (error === 500) {
            fs.unlinkSync(req.file.path);
            return ApiResponse.ERROR(res, "Erro ao cadastrar o funcionário");
        }

        // 5. Resposta de sucesso
        return ApiResponse.CREATED(res, {
            id_funcionario: novoFuncionario.id,
            foto_perfil: novoFuncionario.foto_perfil
        }, `${novoFuncionario.descricao} ${novoFuncionario.nome} criado com sucesso!`);

    } catch (error) {
        // 6. Limpeza em caso de erro inesperado
        if (req.file?.path) fs.unlinkSync(req.file.path);
        return ApiResponse.ERROR(res, "Erro ao cadastrar o funcionário", error);
    }
};


// DELETE api/v1/secretaria/:id
const deletarUsuario = async (req, res) => {
    const id = req.params.id
    
    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.

        return ApiResponse.ERROR(res, `Erro interno do servidor.`, { "error": findUserError })
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const [deletado, error] = await deleteUser(id)

    if (error) {
        return ApiResponse.ERROR(res, "Erro ao deletar o usuário")
    } else {

        const [filePath, findPfpError] = await findUserPFP(user)
        if (filePath) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    logger.error(`Erro ao deletar a imagem do perfil do usuário ${user.id}.`, err)
                }
            })
        }

        return ApiResponse.DELETED(res, "Usuário deletado com sucesso!")
    }

}

// PUT api/v1/secretaria/update-requests/:id/approve
const aprovarPedido = async (req, res) => {
    const id = req.params.id
    const updates = req.body // {nome: "nome", rg: "rg"}

    if (!updates) {
        return ApiResponse.BADREQUEST(res, "Os campos de atualização são obrigatórios.")
    }

    if (!id) {
        return ApiResponse.BADREQUEST(res, "O id do pedido é obrigatório.")
    }

    const [updateRequest, findUpdateRequestError] = await findUpdateRequestById(id)

    if (!updateRequest && findUpdateRequestError != 404) {
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    }
    if (!updateRequest && findUpdateRequestError == 404) {
        return ApiResponse.NOTFOUND(res, "Pedido não encontrado.")
    }

    // Verificar as mudanças permitidas
    const { error } = updateUserSchema.validate(updates, { abortEarly: false })

    if (error) {
        const errorMessages = error.details.map(err => err.message)
        return ApiResponse.BADREQUEST(res, errorMessages)
    }

    const [user, findUserError] = await findUserById(updateRequest.user_id)

    if (!user && findUserError != 404) {
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const [updated, updateUserError] = await updateUser(user.id, updates)

    if (!updated) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    await acceptUpdateRequest(id)

    const emailHtml = approved_request_email_template(id, user.nome)
    const [info, sendEmailError] = await sendMail(user.email, `Pedido de alteração de dados aprovado!`, emailHtml)

    if (sendEmailError) {
        return ApiResponse.ERROR(res, `Erro ao enviar email.`)
    }

    return ApiResponse.OK(res, null, "Pedido de alteração de dados aprovado!")
}

// PUT api/v1/secretaria/update-requests/:id/deny
const rejeitarPedido = async (req, res) => {
    const id = req.params.id
    const { motivo } = req.body

    if (!id) {
        return ApiResponse.BADREQUEST(res, "O id do pedido é obrigatório.")
    }

    if (!motivo) {
        return ApiResponse.BADREQUEST(res, "O motivo de rejeição é obrigatório.")
    }

    const [updateRequest, findUpdateRequestError] = await findUpdateRequestById(id)

    if (!updateRequest && findUpdateRequestError != 404) {
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    }
    if (!updateRequest && findUpdateRequestError == 404) {
        return ApiResponse.NOTFOUND(res, "Pedido não encontrado.")
    }

    await denyUpdateRequest(id)

    // Notificando o usuário

    const [user, findUserError] = await findUserById(updateRequest.user_id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`, { "error": findUserError })
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const email = user.email
    const emailHtml = rejected_request_email_template(id, user.nome, motivo)

    const [info, sendEmailError] = await sendMail(email, `Pedido de alteração de negado. `, emailHtml)
    if (sendEmailError) {
        return ApiResponse.ERROR(res, `Erro ao enviar email.`)
    }

    return ApiResponse.OK(res, null, "Pedido de alteração de dados rejeitado!")

}

// PUT api/v1/secretaria/:id
const atualizarUsuario = async (req, res) => {
    const id = req.params.id;
    const updates = req.body;

    if (!id) {
        return ApiResponse.BADREQUEST(res, "O id do pedido é obrigatório.");
    }

    if (req.file) {
        updates.foto_perfil = req.file.path;
    }

    if (Object.keys(updates).length <= 0) {
        return ApiResponse.BADREQUEST(res, "Os campos de atualização são obrigatórios.");
    }

    const [user, findUserError] = await findUserById(id);

    if (!user && findUserError !== 404) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.");
    }

    if (findUserError === 404) {
        return ApiResponse.NOTFOUND(res, "Usuário não encontrado.");
    }

    // Seleciona o schema de acordo com o tipo do usuário
    const schema = user.cargo === "funcionario"
        ? funcionarioUpdateSchema
        : alunoUpdateSchema;

    const { error } = schema.validate(updates, {
        abortEarly: false,
        stripUnknown: false, // 🔥 NÃO remover os campos do outro tipo!
    });

    if (error) {
        const errorMessages = error.details.map(err => err.message);
        return ApiResponse.BADREQUEST(res, errorMessages);
    }

    const [updated, updateUserError] = await updateUser(user.id, updates);

    if (!updated) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.");
    }

    return ApiResponse.OK(res, updated, "Usuário atualizado.");
};

// POST api/v1/secretaria/late-entries/:id/validate
const validarAtraso = async (req, res) => {
    const id = req.params.id
    const {responsavel, observacao } = req.body

    if (!responsavel) {
        return ApiResponse.BADREQUEST(res, "O responsável do redirecionamento é obrigatório.")
    }

    const [foundLateEntry, findLateEntryError] = await getLateEntry(id)

    if (!foundLateEntry) {
        return ApiResponse.NOTFOUND(res, "Registro de atraso não encontrado.")
    }

    if (foundLateEntry.status != "Pendente") {
        return ApiResponse.BADREQUEST(res, `O registro de atraso não pode ser validado, seu status é de ${foundLateEntry.status}`)
    }

    const [result, validateLateEntryError] = await validateLateEntry(id, responsavel, foundLateEntry.motivo, observacao)

    if (!result && validateLateEntryError == 404) {
        return ApiResponse.NOTFOUND(res, "Atraso não encontrado.")
    } else if (!result && validateLateEntryError != 404) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    // Atraso validado, iremos notificar o usuario

    const [user, findUserError] = await findUserById(result.user_id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    // const email = user.email
    // const emailHtml = late_entry_approved_email_template(user.nome, user.turma, moment().format("DD/MM/YYYY - HH:mm"), responsavel)

    // const [info, sendEmailError] = await sendMail(email, `Atraso validado, siga para a sala. `, emailHtml)
    // if (sendEmailError) {
    //     return ApiResponse.ERROR(res, `Erro ao enviar email.`)
    // }

    return ApiResponse.OK(res, { result }, "Atraso validado!")
}

// GET api/v1/secretaria/late-entries/:id
const atrasoPorCodigo = async (req, res) => {
    const id = req.params.id
    const [lateEntry, findLateEntryError] = await getLateEntry(id)

    if (!lateEntry && findLateEntryError == 404) {
        return ApiResponse.NOTFOUND(res, "Registro de atraso não encontrado.")
    } else if (!lateEntry && findLateEntryError != 404) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    return ApiResponse.OK(res, { lateEntry }, "Registro de atraso encontrado.")
}

// DEL api/v1/secretaria/late-entries/:id
const deletarAtraso = async (req, res) => {
    const id = req.params.id

    if (!id) {
        return ApiResponse.BADREQUEST(res, "O id do atraso é obrigatório.")
    }

    const [foundLateEntry, findLateEntryError] = await getLateEntry(id)

    if (!foundLateEntry && findLateEntryError == 404) {
        return ApiResponse.NOTFOUND(res, "Registro de atraso não encontrado.")
    } else if (!foundLateEntry && findLateEntryError != 404) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    const [deleted, deleteLateEntryError] = await deleteLateEntry(id)

    if (!deleted && deleteLateEntryError == 404) {
        return ApiResponse.NOTFOUND(res, "Atraso não encontrado.")
    } else if (!deleted && deleteLateEntryError != 404) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    return ApiResponse.DELETED(res, "Atraso deletado com sucesso!")
}

// PUT api/v1/secretaria/early-exits/:id/allow
const validarSaidaAntecipada = async (req, res) => {
    const id = req.params.id
    const { responsavel, observacao } = req.body

    if (!responsavel || !observacao) {
        return ApiResponse.BADREQUEST(res, "O responsável e a observação são obrigatórios.")
    }

    const [earlyExit, findEarlyExitError] = await getEarlyExit(id)

    if (!earlyExit && findEarlyExitError == 404) {
        return ApiResponse.NOTFOUND(res, "Pedido de liberação não encontrado.")
    } else if (!earlyExit && findEarlyExitError != 404) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    if (earlyExit.status != "Pendente") {
        return ApiResponse.BADREQUEST(res, `O pedido de liberação não pode ser validado, seu status é de ${earlyExit.status}`)
    }

    const [result, allowEarlyExitError] = await allowEarlyExit(id, responsavel, observacao)

    if (!result && allowEarlyExitError == 404) {
        return ApiResponse.NOTFOUND(res, "Pedido de liberação não encontrado.")
    } else if (!result && allowEarlyExitError != 404) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    // Saída antecipada validada, iremos notificar o usuario
    const [user, findUserError] = await findUserById(result.user_id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`, { "error": findUserError })
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário associado ao pedido de liberação não foi encontrado.")
    }

    // const email = user.email
    // const emailHtml = early_exit_approved_template(earlyExit.id, user.nome, earlyExit.motivo, responsavel, moment(earlyExit.horario_saida).tz("America/Sao_Paulo").format("DD/MM/YYYY - HH:mm"), observacao)

    // const [info, sendEmailError] = await sendMail(email, `Pedido de liberação aprovado!`, emailHtml)
    // if (sendEmailError) {
    //     return ApiResponse.ERROR(res, `Erro ao enviar email.`)
    // }

    return ApiResponse.OK(res, { result }, "Pedido de liberação validado!")

}

// PUT api/v1/secretaria/early-exits/:id/deny
const negarSaidaAntecipada = async (req, res) => {
    const id = req.params.id
    const { responsavel, observacao } = req.body

    if (!responsavel || !observacao) {
        return ApiResponse.BADREQUEST(res, "O responsável e a observação são obrigatórios.")
    }

    const [earlyExit, findEarlyExitError] = await getEarlyExit(id)

    if (!earlyExit && findEarlyExitError == 404) {
        return ApiResponse.NOTFOUND(res, "Pedido de liberação não encontrado.")
    } else if (!earlyExit && findEarlyExitError != 404) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    if (earlyExit.status != "Pendente") {
        return ApiResponse.BADREQUEST(res, `O pedido de liberação não pode ser negado, seu status é de ${earlyExit.status}`)
    }

    const [result, denyEarlyExitError] = await denyEarlyExit(id, responsavel, observacao)

    if (!result && denyEarlyExitError == 404) {
        return ApiResponse.NOTFOUND(res, "Pedido de liberação não encontrado.")
    } else if (!result && denyEarlyExitError != 404) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    // Saída antecipada validada, iremos notificar o usuario
    const [user, findUserError] = await findUserById(result.user_id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`, { "error": findUserError })
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário associado ao pedido de liberação não foi encontrado.")
    }

    const email = user.email
    const emailHtml = early_exit_rejected_template(earlyExit.id, user.nome, earlyExit.motivo, responsavel, observacao)

    const [info, sendEmailError] = await sendMail(email, `Pedido de liberação negado!`, emailHtml)
    if (sendEmailError) {
        return ApiResponse.ERROR(res, `Erro ao enviar email.`)
    }

    return ApiResponse.OK(res, null, "Pedido de liberação negado!")

}

// DEL api/v1/secretaria/early-exits/:id
const deletarSaidaAntecipada = async (req, res) => {
    const id = req.params.id

    if (!id) {
        return ApiResponse.BADREQUEST(res, "O id do pedido de liberação é obrigatório.")
    }

    const [earlyExit, findEarlyExitError] = await getEarlyExit(id)

    if (!earlyExit && findEarlyExitError == 404) {
        return ApiResponse.NOTFOUND(res, "Pedido de liberação não encontrado.")
    } else if (!earlyExit && findEarlyExitError != 404) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    const [deleted, deleteEarlyExitError] = await deleteEarlyExit(id)

    if (!deleted && deleteEarlyExitError == 404) {
        return ApiResponse.NOTFOUND(res, "Pedido de liberação não encontrado.")
    } else if (!deleted && deleteEarlyExitError != 404) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    return ApiResponse.DELETED(res, "Pedido de liberação deletado com sucesso!")
}

// GET api/v1/secretaria/late-entries/
const atrasosDeTodosAlunos = async (req, res) => {
    const [lateEntries, findLateEntriesError] = await getAllLateEntries()

    if (findLateEntriesError && findLateEntriesError != 404) {
        logger.error("Erro ao buscar registros de atraso", findLateEntriesError)
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    if (!lateEntries || lateEntries.length === 0) {
        return ApiResponse.OK(res, { lateEntries: [] }, "Registros de atraso encontrados com sucesso.")
    }

    return ApiResponse.OK(res, { lateEntries }, "Registros de atraso encontrados com sucesso.")
}

// GET api/v1/secretaria/early-exits/
const saidasAntecipadasDeTodosAlunos = async (req, res) => {
    const [earlyExits, findEarlyExitsError] = await getAllEarlyExits()

    if (findEarlyExitsError && findEarlyExitsError != 404) {
        logger.error("Erro ao buscar registros de liberações", findEarlyExitsError)
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    if (!earlyExits || earlyExits.length === 0) {
        return ApiResponse.OK(res, { earlyExits: [] }, "Registros de liberações encontrados com sucesso.")
    }

    return ApiResponse.OK(res, { earlyExits }, "Registros de liberações encontrados com sucesso.")
}

// GET api/v1/secretaria/early-exits/:id
const saidaAntecipadaPorId = async (req, res) => {
    const id = req.params.id
    const [earlyExit, findEarlyExitError] = await getEarlyExit(id);
    if (!earlyExit && findEarlyExitError == 404) {
        return ApiResponse.NOTFOUND(res, "Pedido de liberação não encontrado.");
    } else if (!earlyExit && findEarlyExitError != 404) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.");
    }

    return ApiResponse.OK(res, { earlyExit }, "Pedido de liberação encontrado com sucesso.")
}

// GET api/v1/secretaria/update-requests
const pedidosDeAtualizacao = async (req, res) => {
    const [updateRequests, findUpdateRequestsError] = await findAllUpdateRequests()
    if (findUpdateRequestsError && findUpdateRequestsError != 404) {
        logger.error("Erro ao buscar pedidos de atualização", findUpdateRequestsError)
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }
    if (!updateRequests || updateRequests.length === 0) {
        return ApiResponse.NOTFOUND(res, "Nenhum pedido de atualização encontrado.")
    }

    return ApiResponse.OK(res, { updateRequests }, "Pedidos de atualização encontrados com sucesso.")
}


export { registrarAluno, registrarFuncionario, atualizarUsuario, deletarUsuario, aprovarPedido, rejeitarPedido, validarAtraso, atrasoPorCodigo, deletarAtraso, saidaAntecipadaPorId, validarSaidaAntecipada, negarSaidaAntecipada, deletarSaidaAntecipada, saidasAntecipadasDeTodosAlunos, atrasosDeTodosAlunos, pedidosDeAtualizacao };
