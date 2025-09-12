import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cria o diretório se não existir
const uploadDir = path.join(__dirname, '../../../db/fotos_perfil');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Verifica se o CPF foi fornecido
        if (!req.body.cpf) {
            return cb(new Error("CPF é necessário para nomear o arquivo"), false);
        }

        // removendo os pontos e traços do CPF
        const cpf = req.body.cpf.replace(/[.\-]/g, '');

        console.log(`CPF recebido: ${cpf}`);
        console.log(`Nome do arquivo original: ${file.originalname}`);
        // Extrai a extensão do arquivo original
        const ext = path.extname(file.originalname);
        cb(null, `${cpf}_pfp${ext}`);
    }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas (JPEG, PNG, GIF)'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

export default upload;