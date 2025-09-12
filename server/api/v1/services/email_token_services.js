import emailVerificationToken from '../models/email_verification_token_model.js'
import logger from '../lib/logger.js'
const childLogger = logger.child({ service: "email_token_services" })

const createToken = async (user_id, email) => {
    const expires = new Date(Date.now() + 10 * 60 * 1000)
    const tokenCode = Math.floor(100000 + Math.random() * 900000).toString()

    try {
        const token = await emailVerificationToken.create({ user_id, email, token: tokenCode, expires: expires })
        childLogger.info(`Token created for user ${user_id} with email ${email}`)

        return [tokenCode, null]
    } catch (error) {
        childLogger.error(`Error creating token for user ${user_id} with email ${email}`, error)
        return [null, 500]
    }
}

const verifyToken = async (token) => {
    const tokenData = await emailVerificationToken.findOne({ token: token })

    if (!tokenData) {
        return [null, 404]
    } else {
        return [tokenData, null]
    }
}

const deleteToken = async (token) => {
    await emailVerificationToken.deleteMany({ token: token })
    childLogger.info(`Token deleted for user with token ${token}`)
}

export { createToken, verifyToken, deleteToken }