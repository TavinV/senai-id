import { closeLateEntry } from "../services/late_entry_services.js"
import lateEntry from "../models/late_entry_model.js"
import { minuteDiff } from "../lib/Horarios.js"

import logger from "../lib/logger.js"
const childLogger = logger.child({ service: "expired_tokens_job" })


const lateEntryJob = async () => {
    try {
        const now = new Date()
        const pendingEntries = await lateEntry.find({ status: "Pendente" })

        for (const entry of pendingEntries) {
            if (minuteDiff(entry.createdAt, now) > 60) { // 
                closeLateEntry(entry.id)
            }
        }
    } catch (error) {
        logger.error(`Couldn't close late entries due to ${error.message}`)
    }
}

export default lateEntryJob;