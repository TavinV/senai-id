import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

dotenv.config()

// Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// === Rotas ===
import auth_routes from './routes/auth_routes.js'
import early_exit_routes from './routes/early_exit_routes.js'
import late_entry_routes from './routes/late_entry_routes.js'
import logs_routes from './routes/logs_routes.js'
import support_routes from './routes/support_routes.js'
import update_request_routes from './routes/update_request_routes.js'
import user_routes from './routes/user_routes.js'

// === Uso das rotas ===
app.use('/api/auth', auth_routes)
app.use('/api/users', user_routes)
app.use('/api/early-exits', early_exit_routes)
app.use('/api/late-entries', late_entry_routes)
app.use('/api/update-requests', update_request_routes)
app.use('/api/support', support_routes)
app.use('/api/logs', logs_routes)

export default app
