import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

const app = express()


dotenv.config()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
import user_routes from './routes/users_routes.js'
import login_routes from './routes/login_routes.js'
import secretaria from './routes/secretaria_routes.js'
import support from './routes/support_routes.js'
import logs from './routes/logs_routes.js'

app.use("/api/v1/secretaria", secretaria)
app.use("/api/v1/users", user_routes)
app.use("/api/v1/login", login_routes)
app.use("/api/v1/support", support)
app.use("/api/v1/logs", logs)

export default app;