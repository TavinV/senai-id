import { minuteDiff } from "../lib/Horarios.js"

import { deletePasswordResetToken } from '../services/password_reset_services.js'
import PasswordResetToken from '../models/forgot_password_token_model.js'

import { deleteToken } from "../services/email_token_services.js"
import emailVerificationToken from '../models/email_verification_token_model.js'

import logger from "../lib/logger.js"
const childLogger = logger.child({ service: "expired_tokens_job" })

const removeExpiredTokens = async () => {
    try {
        const now = new Date()
        const passwordResetTokens = await PasswordResetToken.find({})
        const emailVerificationTokens = await emailVerificationToken.find({})

        let removedPasswordResetTokens = 0
        for (const token of passwordResetTokens) {
            if (minuteDiff(now, token.createdAt) > 20) {
                await deletePasswordResetToken(token.token)
                removedPasswordResetTokens++
            }
        }

        let removedEmailVerificationTokens = 0
        for (const token of emailVerificationTokens) {
            if (minuteDiff(now, token.expires) > 20) {
                await deleteToken(token.token)
                removedPasswordResetTokens++
            }
        }


        if (removedEmailVerificationTokens != 0) {
            childLogger.info(`Removed ${removedEmailVerificationTokens} expired email verification tokens`)
        }
        if (removedPasswordResetTokens != 0) {
            childLogger.info(`Removed ${removedPasswordResetTokens} expired password reset tokens`)
        }


    } catch (error) {

    }
}

export default removeExpiredTokens