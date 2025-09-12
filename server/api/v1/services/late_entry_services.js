import lateEntry from '../models/late_entry_model.js'
import logger from '../lib/logger.js'
const childLogger = logger.child({ service: "late_entry_services" })

const createLateEntry = async (user_id) => {
    const lateEntryId = Array.from({ length: 8 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join('');

    try {
        const newEntry = await lateEntry.create({ id: lateEntryId, user_id, responsavel: "-", motivo: "-", observacao: "-" })
        childLogger.info(`Late entry created for user ${user_id}`)

        return [newEntry, null]
    } catch (error) {
        childLogger.error(`Error creating late entry for user ${user_id}`, error)
        return [null, 500]
    }
}

const validateLateEntry = async (late_entry_id, responsiblePerson, reason, observation) => {
    let foundLateEntry = await lateEntry.findOne({ id: late_entry_id })

    if (!foundLateEntry) {
        return [null, 404]
    }

    try {
        const result = await lateEntry.findOneAndUpdate({ id: late_entry_id }, { responsavel: responsiblePerson, motivo: reason, status: 'Validado', observacao: observation || "" })
        const updated = await lateEntry.findOne({ id: late_entry_id })

        return [updated, null]
    } catch (error) {
        childLogger.error(`Error validating late entry ${late_entry_id}`, error)
        return [null, 500]
    }
}

const getLateEntries = async (user_id) => {
    const lateEntries = await lateEntry.find({ user_id })
    return [lateEntries, null]
}

const getAllLateEntries = async () => {
    const lateEntries = await lateEntry.find({})
    if (!lateEntries || lateEntries.length === 0) {
        return [null, 404]
    }
    return [lateEntries, null]
}

const getLateEntry = async (late_entry_id) => {
    let foundLateEntry = await lateEntry.findOne({ id: late_entry_id })

    if (!foundLateEntry) {
        return [null, 404]
    }
    return [foundLateEntry, null]
}

const closeLateEntry = async (late_entry_id) => {
    let foundLateEntry = await lateEntry.findOne({ id: late_entry_id })

    if (!foundLateEntry) {
        return [null, 404]
    }
    try {
        const result = await lateEntry.findOneAndUpdate({ id: late_entry_id }, { status: 'Fechado' })
        return [result, null]
    } catch (error) {
        childLogger.error(`Error closing late entry ${late_entry_id}`, error)
        return [null, 500]
    }

}

const deleteLateEntry = async (late_entry_id) => {
    let foundLateEntry = await lateEntry.findOne({ id: late_entry_id })
    if (!foundLateEntry) {
        return [null, 404]
    }
    try {
        const result = await lateEntry.deleteOne({ id: late_entry_id })

        if (result.deletedCount === 0) {
            return [null, 404]
        }

        return [result, null]
    } catch (error) {
        childLogger.error(`Error deleting late entry ${late_entry_id}`, error)
        return [null, 500]
    }

}


export { createLateEntry, validateLateEntry, getLateEntries, getLateEntry, closeLateEntry, deleteLateEntry, getAllLateEntries }