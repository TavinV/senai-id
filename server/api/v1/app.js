import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

dotenv.config();
const app = express();

// 🔒 Rate Limit 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
});

// 🛟 Configuração correta de CORS — aceita Vite + produção
const corsOptions = {
    // Accept requests from the dev server and production; reflect origin when possible
    origin: (origin, callback) => {
        // allow requests with no origin (like server-to-server or curl)
        if (!origin) return callback(null, true);
        const allowed = [
            "http://localhost:5173",
            "https://senai-id-1.onrender.com"
        ];
        if (allowed.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        // Fallback: allow other origins during development
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Enable pre-flight for all routes

// 🧹 Middlewares essenciais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import auth_routes from './routes/auth_routes.js';
import early_exit_routes from './routes/early_exit_routes.js';
import late_entry_routes from './routes/late_entry_routes.js';
import logs_routes from './routes/logs_routes.js';
import support_routes from './routes/support_routes.js';
import update_request_routes from './routes/update_request_routes.js';
import user_routes from './routes/user_routes.js';

app.use('/api/auth', auth_routes);
app.use('/api/users', user_routes);
app.use('/api/early-exits', early_exit_routes);
app.use('/api/late-entries', late_entry_routes);
app.use('/api/update-requests', update_request_routes);
app.use('/api/support', support_routes);
app.use('/api/logs', logs_routes);

export default app;
