# 🧭 **Senai ID — Documentação da API**

**Base URL:** `http://localhost:3000/api`  
**Versão:** 1.0  
**Formato:** `JSON`  
**Autenticação:** JWT (Bearer Token)

---

## 📦 Padrão de Resposta

Todas as rotas retornam o seguinte padrão de resposta:

```json
{
  "success": true,
  "message": "Mensagem de retorno",
  "data": { ... },
  "timestamp": "2023-11-15T12:00:00.000Z"
}
```

---

## 🔐 Auth

### Login

| Método | Endpoint       | Autenticação |
|--------|----------------|--------------|
| POST   | `/auth`        | ❌ Pública    |

**Descrição:** Autentica um usuário e retorna um token JWT.

#### 📨 Body (JSON)
```json
{
  "login": "usuario",
  "senha": "senha"
}
```

#### 📤 Respostas
| Código | Descrição                       | Exemplo |
|--------|----------------------------------|---------|
| 200    | Login bem-sucedido              | Retorna token JWT e dados do usuário |
| 400    | Credenciais inválidas           | `{"success": false, "message": "Login ou senha inválidos"}` |

---

## 👤 Users

### Listar usuários

| Método | Endpoint     | Autenticação            |
|--------|--------------|-------------------------|
| GET    | `/users`     | ✅ Secretaria (Bearer)   |

| Código | Descrição                |
|--------|---------------------------|
| 200    | Lista de usuários        |

---

### Buscar usuário por ID

| Método | Endpoint            | Autenticação            |
|--------|---------------------|-------------------------|
| GET    | `/users/:id`        | ✅ Secretaria (Bearer)   |

| Código | Descrição                    |
|--------|-------------------------------|
| 200    | Usuário encontrado           |
| 404    | Usuário não encontrado       |

---

### Buscar usuário logado

| Método | Endpoint        | Autenticação          |
|--------|-----------------|-----------------------|
| GET    | `/users/me`     | ✅ Aluno (Bearer)     |

| Código | Descrição                    |
|--------|-------------------------------|
| 200    | Dados do usuário logado      |
| 401    | Token inválido ou expirado  |

---

### Criar aluno

| Método | Endpoint     | Autenticação            |
|--------|--------------|-------------------------|
| POST   | `/users`     | ✅ Secretaria (Bearer)   |

#### 📨 Body (form-data)
| Campo              | Tipo    | Obrigatório | Descrição                      |
|---------------------|---------|-------------|----------------------------------|
| nome               | string  | ✅           | Nome completo do aluno          |
| cpf                | string  | ✅           | CPF                             |
| senha              | string  | ✅           | Senha inicial                   |
| turma              | string  | ✅           | Turma do aluno                  |
| matricula          | string  | ✅           | Matrícula                       |
| data_nascimento    | date    | ✅           | Data de nascimento              |
| curso              | string  | ✅           | Curso                           |
| foto_perfil        | file    | ❌           | Foto de perfil (upload)         |

#### 📤 Respostas
| Código | Descrição                            |
|--------|---------------------------------------|
| 201    | Usuário criado com sucesso           |
| 400    | Dados inválidos                      |
| 409    | CPF ou matrícula já cadastrados      |

---

### Atualizar usuário

| Método | Endpoint          | Autenticação            |
|--------|-------------------|-------------------------|
| PUT    | `/users/:id`      | ✅ Secretaria (Bearer)   |

| Código | Descrição                            |
|--------|---------------------------------------|
| 200    | Usuário atualizado com sucesso       |
| 400    | Dados inválidos                      |
| 404    | Usuário não encontrado               |

---

### Deletar usuário

| Método | Endpoint          | Autenticação            |
|--------|-------------------|-------------------------|
| DELETE | `/users/:id`      | ✅ Secretaria (Bearer)   |

| Código | Descrição                            |
|--------|---------------------------------------|
| 200    | Usuário deletado                     |
| 404    | Usuário não encontrado               |

---

### Gerar QR Code / acesso

| Método | Endpoint              | Autenticação         |
|--------|-----------------------|----------------------|
| GET    | `/users/me/access`    | ✅ Aluno (Bearer)    |

| Código | Descrição                    |
|--------|-------------------------------|
| 200    | QR Code gerado               |
| 401    | Token inválido              |

---

## 📧 Email & Senha

| Método | Endpoint                                           | Descrição                        | Auth |
|--------|----------------------------------------------------|-----------------------------------|------|
| POST   | `/users/:id/verify-email/request-token`            | Solicita token de verificação    | ❌   |
| POST   | `/users/:id/verify-email/validate-token`           | Valida token de verificação      | ❌   |
| POST   | `/users/forgot-password`                           | Solicita redefinição de senha    | ❌   |
| PUT    | `/users/reset-password`                             | Redefine senha                   | ❌   |
| PUT    | `/users/:id/setup-password`                         | Configura senha inicial          | ❌   |

**Códigos de resposta comuns:**  
- `200`: Operação bem-sucedida  
- `400`: Dados inválidos  
- `404`: Usuário/token inválido ou expirado

---

## 📝 Update Requests

| Método | Endpoint                                  | Descrição                             | Auth                 |
|--------|-------------------------------------------|----------------------------------------|----------------------|
| POST   | `/users/me/request-update`                | Criar solicitação (Aluno)             | ✅ Aluno             |
| GET    | `/users/me/update-requests`               | Listar solicitações do aluno         | ✅ Aluno             |
| GET    | `/users/me/update-requests/:id`           | Buscar solicitação específica        | ✅ Aluno             |
| GET    | `/update-requests`                        | Listar solicitações (Admin)          | ✅ Secretaria        |
| PUT    | `/update-requests/:id/approve`            | Aprovar solicitação (Admin)          | ✅ Secretaria        |
| PUT    | `/update-requests/:id/deny`               | Negar solicitação (Admin)            | ✅ Secretaria        |

---

## ⏰ Late Arrivals (Atrasos)

| Método | Endpoint                                  | Descrição                           | Auth                 |
|--------|-------------------------------------------|--------------------------------------|----------------------|
| GET    | `/late-arrivals/me`                       | Listar atrasos do aluno            | ✅ Aluno             |
| GET    | `/late-arrivals/me/:id`                   | Buscar atraso específico           | ✅ Aluno             |
| POST   | `/late-arrivals/me/request`              | Criar pedido de atraso            | ✅ Aluno             |
| GET    | `/late-arrivals`                          | Listar atrasos (Admin)             | ✅ Secretaria        |
| GET    | `/late-arrivals/:id`                      | Buscar atraso (Admin)             | ✅ Secretaria        |
| PUT    | `/late-arrivals/:id/validate`             | Validar atraso (Admin)            | ✅ Secretaria        |
| DELETE | `/late-arrivals/:id`                      | Deletar atraso                    | ✅ Secretaria        |

---

## 🏃 Early Leaves (Saídas antecipadas)

| Método | Endpoint                                  | Descrição                              | Auth                 |
|--------|-------------------------------------------|-----------------------------------------|----------------------|
| GET    | `/early-leaves/me`                        | Listar saídas (Aluno)                  | ✅ Aluno             |
| GET    | `/early-leaves/me/:id`                    | Buscar saída específica (Aluno)        | ✅ Aluno             |
| POST   | `/early-leaves/me/request`               | Criar pedido de saída (Aluno)         | ✅ Aluno             |
| GET    | `/early-leaves`                           | Listar saídas (Admin)                 | ✅ Secretaria        |
| PUT    | `/early-leaves/:id/allow`                 | Aprovar saída                         | ✅ Secretaria        |
| PUT    | `/early-leaves/:id/deny`                  | Negar saída                           | ✅ Secretaria        |
| DELETE | `/early-leaves/:id`                       | Deletar saída                         | ✅ Secretaria        |

---

## 🆘 Suporte

| Método | Endpoint                     | Descrição                    | Auth |
|--------|------------------------------|-------------------------------|------|
| POST   | `/support/send-message`      | Envia mensagem de suporte    | ❌   |

#### 📨 Body
```json
{
  "nome": "Otávio Vinícius Flauzino de Souza",
  "telefone": "11 95023-1230",
  "mensagem": "Olá, estou com um problema no acesso."
}
```

---

## 🪵 Logs

| Método | Endpoint                  | Descrição               | Auth           |
|--------|---------------------------|--------------------------|---------------|
| GET    | `/logs/info`             | Log de informações       | ✅ Secretaria |
| GET    | `/logs/exception`        | Log de exceções          | ✅ Secretaria |
| GET    | `/logs/rejection`        | Log de rejeições         | ✅ Secretaria |

---

## ⚠️ Códigos de Status Comuns

| Código | Significado                      |
|--------|-----------------------------------|
| 200    | OK                               |
| 201    | Criado com sucesso               |
| 400    | Requisição inválida              |
| 401    | Não autorizado                   |
| 403    | Proibido                         |
| 404    | Não encontrado                   |
| 409    | Conflito (ex: já existente)      |
| 500    | Erro interno no servidor         |

---

## 🛡️ Autenticação e Permissões

| Tipo de Usuário | Exemplo de uso                  |
|-----------------|----------------------------------|
| Pública         | Login, recuperação de senha     |
| Aluno           | Acesso a dados próprios         |
| Secretaria      | Gestão de usuários e registros  |

**Header de autenticação:**
```
Authorization: Bearer <token>
```
