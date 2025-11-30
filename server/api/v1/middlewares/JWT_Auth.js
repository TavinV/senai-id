import { verifyJwt } from "../auth/JWT_services.js";
import ApiResponse from "../lib/ApiResponse.js";

// Middleware para verificar a validade de um Token JWT, e pode verificar permissões.
const validateSessionToken = (deveSerSecretaria = false) => (req, res, next) => {

    // ⚠️ LIBERA TODAS AS REQUISIÇÕES OPTIONS PARA CORS FUNCIONAR
    if (req.method === "OPTIONS") {
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return ApiResponse.BADREQUEST(res, "Token não fornecido.")
    }

    const token = authHeader.split(' ')[1];
    const [decoded, validationError] = verifyJwt(token);

    switch (validationError) {
        case 401:
            return ApiResponse.UNAUTHORIZED(res, "Token inválido.")
        case 500:
            return ApiResponse.ERROR(res, "Erro ao verificar token.")
        case null:
            const cargo = decoded.cargo;

            if (deveSerSecretaria && cargo !== "secretaria") {
                return ApiResponse.FORBIDDEN(res, "Acesso negado.");
            }

            req.decoded = decoded;
            return next();
    }
};


export default validateSessionToken;
