import EarlyExit from '../models/early_exit_model.js'

import logger from '../lib/logger.js'
const childLogger = logger.child({ service: "early_exit_services" })

const requestEarlyExit = async (user_id, motivo, horario_saida) => {
    const lateEntryId = Array.from({ length: 8 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join('');
    try {
        const earlyExit = await EarlyExit.create({
            user_id,
            id: lateEntryId,
            motivo,
            horario_saida,
            responsavel: "-",
            observacao: "-",
        })
        childLogger.info(`Early exit requested for user ${user_id}`)
        return [earlyExit, null]

    } catch (error) {
        childLogger.error(`Error requesting early exit for user ${user_id}: ${error.message}`)
        return [null, 500]
    }
}

const getEarlyExit = async (early_exit_id) => {
    try {
        const earlyExit = await EarlyExit.findOne({ id: early_exit_id })
        if (!earlyExit) {
            return [null, 404]
        }
        return [earlyExit, null]
    } catch (error) {
        childLogger.error(`Error fetching early exit ${early_exit_id}: ${error.message}`)
        return [null, 500]
    }
}


const allowEarlyExit = async (early_exit_id, responsavel, observacao) => {
    try {
        const earlyExit = await EarlyExit.findOne({ id: early_exit_id })

        if (!earlyExit) {
            return [null, 404]
        }

        const updatedEarlyExit = await EarlyExit.findOneAndUpdate(
            { id: early_exit_id },
            { responsavel, status: 'Permitida', observacao, horario_saida: new Date() },
        )
        return [updatedEarlyExit, null]
    } catch (error) {
        childLogger.error(`Error validating early exit ${early_exit_id}: ${error.message}`)
        return [null, 500]
    }
}

const denyEarlyExit = async (early_exit_id, responsavel, observacao) => {
    try {
        const earlyExit = await EarlyExit.findOne({ id: early_exit_id })
        if (!earlyExit) {
            return [null, 404]
        }
        const updatedEarlyExit = await EarlyExit.findOneAndUpdate(
            { id: early_exit_id },
            { responsavel, status: 'Não permitida', observacao }
        )
        return [updatedEarlyExit, null]
    } catch (error) {
        childLogger.error(`Error denying early exit ${early_exit_id}: ${error.message}`)
        return [null, 500]
    }
}

const getEarlyExitsByUser = async (user_id) => {
    try {
        const earlyExits = await EarlyExit.find({ user_id })
        return [earlyExits, null]
    } catch (error) {
        childLogger.error(`Error fetching early exits for user ${user_id}: ${error.message}`)
        return [null, 500]
    }
}

const deleteEarlyExit = async (early_exit_id) => {
    try {
        const result = await EarlyExit.deleteOne({ id: early_exit_id })
        if (result.deletedCount === 0) {
            return [null, 404]
        }
        childLogger.info(`Early exit ${early_exit_id} deleted successfully`)
        return [true, null]
    } catch (error) {
        childLogger.error(`Error deleting early exit ${early_exit_id}: ${error.message}`)
        return [null, 500]
    }
}

const getAllEarlyExits = async () => {
    try {
        const earlyExits = await EarlyExit.find({})
        if (!earlyExits || earlyExits.length === 0) {
            return [null, 404]
        }
        return [earlyExits, null]
    } catch (error) {
        childLogger.error(`Error fetching all early exits: ${error.message}`)
        return [null, 500]
    }
}

export {
    requestEarlyExit,
    getEarlyExit,
    allowEarlyExit,
    denyEarlyExit,
    getEarlyExitsByUser,
    deleteEarlyExit,
    getAllEarlyExits
}