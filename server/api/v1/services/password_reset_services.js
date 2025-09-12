import PasswordResetToken from '../models/forgot_password_token_model.js'
import { randomBytes } from 'crypto'

import logger from '../lib/logger.js'
const childLogger = logger.child({ service: "password_reset_services" })

const createPasswordResetToken = async (user_id) => {
    const tokenCode = randomBytes(30).toString('hex')
    const expires = new Date(Date.now() + 10 * 60 * 1000)

    try {
        const passwordResetToken = await PasswordResetToken.create({ user_id, token: tokenCode, expires })

        childLogger.info(`Password reset token created for user ${user_id}`)
        return [tokenCode, null]

    } catch (error) {
        childLogger.error(`Error creating password reset token`, error)
        return [false, 500]
    }
}

const verifyPasswordResetToken = async (token) => {
    const tokenData = await PasswordResetToken.findOne({ token: token })

    if (!tokenData) {
        return [null, 404]
    } else {
        return [tokenData, null]
    }
}

const deletePasswordResetToken = async (token) => {
    await PasswordResetToken.deleteMany({ token: token })
    childLogger.info(`Password reset token ${token} deleted`)
}

export { createPasswordResetToken, verifyPasswordResetToken, deletePasswordResetToken }
