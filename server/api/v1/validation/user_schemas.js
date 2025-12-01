import Joi from "joi";

// Schema completo de aluno
export const alunoSchema = Joi.object({
    nome: Joi.string().required(),
    cpf: Joi.string().length(14).required(),
    senha: Joi.string().required(),
    turma: Joi.string().required(),
    matricula: Joi.string().required(),
    data_nascimento: Joi.string().required(),
    curso: Joi.string().required(),
    foto_perfil: Joi.any(),
});

// Schema completo de funcionário
export const funcionarioSchema = Joi.object({
    nome: Joi.string().required(),
    cpf: Joi.string().length(14).required(),
    senha: Joi.string().required(),
    pis: Joi.string().length(11).required(),
    descricao: Joi.string(),
    nif: Joi.string(),
    email: Joi.string().email().required(),
    foto_perfil: Joi.any(),
});

// Schema UPDATE aluno
export const alunoUpdateSchema = alunoSchema.fork(
    Object.keys(alunoSchema.describe().keys),
    (field) => field.optional()
);

// Schema UPDATE funcionário
export const funcionarioUpdateSchema = funcionarioSchema.fork(
    Object.keys(funcionarioSchema.describe().keys),
    (field) => field.optional()
);
