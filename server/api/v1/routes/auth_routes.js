import express from 'express'
import { loginUser } from '../controllers/login_controller.js'
import rateLimit from 'express-rate-limit';

const router = express.Router()

const loginLimiter = rateLimit({
    windowMs: 50 * 60 * 1000, // 5 minutes
    max: 5, // Limit each IP to 5 login requests per `window` (here, per 5 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Você excedeu o número máximo de tentativas de login. Por favor, tente novamente mais tarde.'
});

// POST /api/auth
router.post('/', loginLimiter, loginUser)

export default router
