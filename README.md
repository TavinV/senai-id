# Senai ID - API

### 📌 Sistema de Controle de Acesso Digital para o SENAI

Senai ID é um sistema de controle de acesso desenvolvida para substituir as carteirinhas físicas do SENAI por carteirinhas digitais, otimizando o processo de entrada e saída dos alunos. Além disso, oferece funcionalidades para atualização cadastral, controle de atrasos e gestão acadêmica. Este projeto é um TCC

## 🚀 Tecnologias Utilizadas

- **Node.js** (v22.3.0 recomendado)
- **Express** - Framework para construção da API REST
- **MongoDB** (versão mais recente recomendada)
- **Mongoose** - ODM para modelagem do banco de dados
- **JWT** - Autenticação e controle de sessão
- **Joi** - Validação de dados
- **Multer** - Upload e armazenamento de arquivos
- **Winston** - Sistema de logging
- **Nodemailer** - Envio de notificações por e-mail
- **Crypto** - Criptografia de senhas (SHA-256)
- **Cors, body-parser, moment, path, node-cron** - Utilitários diversos

---

## 📂 Estrutura do Projeto

```
api/
│── v1/        # Código principal da API (controllers, services, middlewares, models, routes, etc.)
│── db/        # Armazenamento de fotos de perfil
│── logs/      # Logs do sistema (exceptions, info, rejection)
│── .env.example  # Exemplo de configuração do ambiente
```

---

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto e configure conforme o exemplo abaixo (tambem no arquivo `.env.example`):

```
# Chave secreta para autenticação (substitua por um valor seguro)
SECRET=your_secret_key_here

# String de conexão com o MongoDB (substitua com suas credenciais)
MONGODB_CONNECTION=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority&appName=your_app_name

# Credenciais para envio de e-mails (substitua pelo seu e-mail e senha de app)
NOREPLY_EMAIL=your_email@gmail.com
NOREPLY_EMAIL_PASS=your_email_app_password

# Nivel do logger
LOG_LEVEL=info
```

---

## 📌 Instalação e Uso

1. Clone o repositório:
   ```bash
   git clone https://github.com/TavinV/senaiid-api.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env` conforme o modelo `.env.example`.

4. Inicie o servidor:
   ```bash
   npm run start
   ```
   O servidor será executado na **porta 3000**.

---

## 🔑 Autenticação e Permissões

O login é realizado via **nome de usuário e senha**, retornando um **token JWT** com as permissões do usuário autenticado.
Essas são as permissões dos diferentes níveis de usuários:

- **Usuários padrão (Alunos e Funcionários)**: acesso ao QR Code para entrada, troca de senha, solicitação de alteração cadastral.
- **Funcionários**: não possuem registro de atraso e podem acessar o SENAI a qualquer momento.
- **Secretaria**: controle total sobre os usuários, incluindo aprovação de pedidos de alteração de dados, validação de atrasos e cadastro de novos alunos.



## 📜 Registro de Logs

Os logs são armazenados na pasta `api/logs/`, com nível padrão **INFO** (configurável via `.env`).



## 📞 Contato

Dúvidas ou suporte? Entre em contato:
📧 **otavioviniciusads@gmail.com**



## 📌 Documentação da API

A documentação completa das rotas está disponível em breve.

<hr>

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/SENAI_São_Paulo_logo.png/800px-SENAI_São_Paulo_logo.png" width="350" title="hover text">
</p>
