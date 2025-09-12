import User from '../models/user_model.js'
import { criarHash } from '../lib/Criptografar.js'

import path from "path"
import { fileURLToPath } from 'url';
import fs from 'fs'

import logger from '../lib/logger.js'
const childLogger = logger.child({ service: "user_services" })

// Para utilizar o __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const findUserById = async (id) => {
    try {
        const user_found = await User.findOne({ id: id }); // Busca pelo campo id
        if (!user_found) {
            return [null, 404];
        }
        return [user_found, null];
    } catch (error) {
        return [null, error];
    }
};

const findAllUsers = async () => {
    try {
        const users = await User.find({});
        return [users, null];
    } catch (error) {
        return [null, error];
    }
};

const findUserByEmail = async (email) => {

    try {
        const user_found = await User.findOne({ email });
        if (!user_found) {
            return [null, 404];
        }
        return [user_found, null];
    } catch (error) {
        return [null, error];
    }
}

const validateUserLogin = async (identificador, senha) => {
    try {
        // Determina o campo de busca baseado no formato do identificador
        const query = identificador.startsWith('secretaria')
            ? { login_secretaria: identificador }
            : { cpf: identificador };

        const usuario = await User.findOne(query);

        if (!usuario) {
            return [null, 404]; // Usuário não encontrado
        }

        const senhaCriptografada = criarHash(senha, usuario.salt);

        if (senhaCriptografada === usuario.senha) {
            return [usuario, null]; // Autenticação bem-sucedida
        }

        return [null, 401]; // Senha incorreta

    } catch (error) {
        return [null, error];
    }
};

const findUserPFP = async (user) => {
    try {
        // Normaliza o identificador do usuário (remove caracteres especiais)
        const userIdentifier = user.cpf ? user.cpf.replace(/[.\-]/g, '') : user.id;

        // Formatos de imagem suportados (em ordem de prioridade)
        const supportedFormats = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
        const basePath = path.join(__dirname, '../../../db/fotos_perfil/');

        // Padrões de nome de arquivo possíveis
        const possiblePatterns = [
            `${userIdentifier}_pfp`,  // Padrão atual
            userIdentifier,           // Apenas o ID/CPF
            `user_${userIdentifier}`  // Outro padrão comum
        ];

        // Verifica cada combinação de padrão e formato
        for (const pattern of possiblePatterns) {
            for (const format of supportedFormats) {
                const filePath = path.join(basePath, `${pattern}${format}`);

                if (fs.existsSync(filePath)) {
                    return [filePath, null]; // Retorna o primeiro arquivo encontrado
                }
            }
        }

        // Se nenhum arquivo for encontrado
        return [null, 404];

    } catch (error) {
        console.error('Erro ao buscar foto de perfil:', error);
        return [null, 500];
    }
};


const generateQRCODE = (user) => {
    let accessKey = ""

    switch (user.cargo) {
        case "aluno":
            accessKey = user.matricula.toString().padStart(20, '0');
            break;
        case "funcionario":
            accessKey = user.nif.toString().padStart(20, '0');
            break;

    }

    return `https://api.qrserver.com/v1/create-qr-code/?data=${accessKey}&amp;size=100x100`
}

const updateUser = async (user_id, data) => {
    const user_found = await User.findOne({ id: user_id }); // Busca pelo campo id

    if (!user_found) {
        return [false, 404];
    }
    try {
        const result = await User.findOneAndUpdate({ id: user_id }, data)
        childLogger.info(`User ${user_id} updated`)

        return [true, null]
    } catch (error) {
        childLogger.error(`Error updating user ${user_id}`, error)
        return [false, 500]
    }
}

const createUser = async (user) => {
    try {
        const result = await User.create(user)
        childLogger.info(`User ${user.id} created`)
        return [result, null]
    } catch (error) {

        if (error.code === 11000) {
            childLogger.error(`User ${user.id} already exists`, error)
            return [null, 409]
        } else {
            childLogger.error(`Error creating user ${user.id}`, error)
            return [null, 500]
        }
    }

}

const deleteUser = async (user_id) => {
    try {
        const result = await User.deleteOne({ id: user_id })
        childLogger.info(`User ${user_id} deleted`)
        return [result, null]
    } catch (error) {
        childLogger.error(`Error deleting user ${user_id}`, error)
        return [null, 500]
    }
}

export { findUserById, validateUserLogin, findUserPFP, generateQRCODE, updateUser, createUser, deleteUser, findUserByEmail, findAllUsers }