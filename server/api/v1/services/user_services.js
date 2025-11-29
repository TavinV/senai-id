import User from '../models/user_model.js'
import { criarHash } from '../lib/Criptografar.js'

import path from "path"
import { fileURLToPath } from 'url';
import fs from 'fs'

import logger from '../lib/logger.js'
const childLogger = logger.child({ service: "user_services" })

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utilitário para remover campos sensíveis
const sanitizeUser = (user) => {
    if (!user) return user;
    const obj = user.toObject ? user.toObject() : user;
    delete obj.senha;
    delete obj.salt;
    return obj;
};

const findUserById = async (id) => {
    try {
        const user_found = await User.findOne({ id: id });
        if (!user_found) return [null, 404];
        return [sanitizeUser(user_found), null];
    } catch (error) {
        return [null, error];
    }
};

const findAllUsers = async () => {
    try {
        const users = await User.find({});
        const sanitized = users.map(u => sanitizeUser(u));
        return [sanitized, null];
    } catch (error) {
        return [null, error];
    }
};

const findUserByEmail = async (email) => {
    try {
        const user_found = await User.findOne({ email });
        if (!user_found) return [null, 404];
        return [sanitizeUser(user_found), null];
    } catch (error) {
        return [null, error];
    }
};

const validateUserLogin = async (identificador, senha) => {
    try {
        const query = identificador.startsWith('111.222')
            ? { login: identificador }
            : { cpf: identificador };

        const usuario = await User.findOne(query);
        if (!usuario) return [null, 404];

        const senhaCriptografada = criarHash(senha, usuario.salt);

        if (senhaCriptografada === usuario.senha) {
            return [sanitizeUser(usuario), null];
        }

        return [null, 401];
    } catch (error) {
        return [null, error];
    }
};

const findUserPFP = async (user) => {
    try {
        const userIdentifier = user.cpf ? user.cpf.replace(/[.\-]/g, '') : user.id;
        const supportedFormats = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
        const basePath = path.join(__dirname, '../../../db/fotos_perfil/');

        const possiblePatterns = [
            `${userIdentifier}_pfp`,
            userIdentifier,
            `user_${userIdentifier}`
        ];

        for (const pattern of possiblePatterns) {
            for (const format of supportedFormats) {
                const filePath = path.join(basePath, `${pattern}${format}`);
                if (fs.existsSync(filePath)) return [filePath, null];
            }
        }

        return [null, 404];

    } catch (error) {
        console.error('Erro ao buscar foto de perfil:', error);
        return [null, 500];
    }
};

const generateQRCODE = (user) => {
    let accessKey = "";

    switch (user.cargo) {
        case "aluno":
            accessKey = user.matricula.toString().padStart(20, '0');
            break;
        case "funcionario":
            accessKey = user.nif.toString().padStart(20, '0');
            break;
    }

    return `https://api.qrserver.com/v1/create-qr-code/?data=${accessKey}&amp;size=100x100`;
};

const updateUser = async (user_id, data) => {
    const user_found = await User.findOne({ id: user_id });
    if (!user_found) return [false, 404];

    try {
        const updated = await User.findOneAndUpdate({ id: user_id }, data, { new: true });
        childLogger.info(`User ${user_id} updated`);
        return [sanitizeUser(updated), null];
    } catch (error) {
        childLogger.error(`Error updating user ${user_id}`, error);
        return [false, 500];
    }
}

const createUser = async (user) => {
    try {
        const result = await User.create(user);
        childLogger.info(`User ${user.id} created`);
        return [sanitizeUser(result), null];
    } catch (error) {
        if (error.code === 11000) {
            childLogger.error(`User ${user.id} already exists`, error);
            return [null, 409];
        } else {
            childLogger.error(`Error creating user ${user.id}`, error);
            return [null, 500];
        }
    }
}

const deleteUser = async (user_id) => {
    try {
        const result = await User.deleteOne({ id: user_id });
        childLogger.info(`User ${user_id} deleted`);
        return [result, null];
    } catch (error) {
        childLogger.error(`Error deleting user ${user_id}`, error);
        return [null, 500];
    }
}

const findUser = async (query) => {
    try {
        const result = await User.findOne(query);
        if (!result) return [null, 404];
        return [sanitizeUser(result), null];
    } catch (error) {
        console.error(error);
        return [null, 404];
    }
}

export {
    findUserById,
    findUser,
    validateUserLogin,
    findUserPFP,
    generateQRCODE,
    updateUser,
    createUser,
    deleteUser,
    findUserByEmail,
    findAllUsers
}
