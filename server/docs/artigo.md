# SENAI NAMI JAFET  
## SISTEMA DE CARTEIRINHA DIGITAL  
### Documentação Técnica — TCC  
Otávio — 2025  

---

# **RESUMO**

Este trabalho apresenta o desenvolvimento de um sistema de Carteirinha Digital para o SENAI Nami Jafet, projetado para modernizar e agilizar o controle de acesso de estudantes e funcionários, substituindo carteirinhas físicas desgastadas por um mecanismo digital baseado em QR Code. O sistema também integra funcionalidades de registro de entrada, saída, atrasos, justificativas e administração escolar. Utilizando a stack MERN (MongoDB, Express, React e Node.js), a solução unifica validações, reduz filas, melhora a segurança e traz maior rastreabilidade dos acessos. Este documento descreve o problema, a fundamentação teórica, a metodologia empregada e a implementação completa do sistema.

**Palavras-chave:** Carteirinha Digital; Controle de Acesso; QR Code; Sistema Web; MERN; Transformação Digital.

---

# **1 INTRODUÇÃO**

## **1.1 Contextualização**

O uso de carteirinhas físicas sempre foi o principal meio de autenticação na entrada escolar do SENAI Nami Jafet. Com o tempo, o desgaste dos cartões passou a dificultar a leitura pelas catracas, gerando longas filas nos horários de pico. Paralelamente, o registro de atrasos e liberações dependia de anotações manuais, reduzindo a eficiência e a confiabilidade do processo.

Diante desse cenário, a digitalização da identificação escolar tornou-se uma necessidade concreta. A integração de tecnologias modernas, como QR Codes dinâmicos, bancos de dados estruturados e interfaces responsivas, abre espaço para um fluxo mais seguro, ágil e padronizado.

## **1.2 Apresentação do problema**

Entre os principais problemas identificados no processo manual, destacam-se:

- desgaste de carteirinhas físicas, dificultando a leitura;
- necessidade de reimpressões constantes;
- filas longas na entrada e saída;
- registros manuais de atrasos e saídas antecipadas;
- impossibilidade de auditoria centralizada;
- baixa rastreabilidade do histórico de acessos;
- vulnerabilidade a fraudes (como empréstimo de carteirinhas).

## **1.3 Objetivo geral**

Desenvolver um sistema digital de carteirinhas baseado em QR Codes, integrado ao fluxo escolar, que otimize o processo de acesso, registro de presença e controle administrativo.

## **1.4 Objetivos específicos**

- criar uma plataforma web responsiva para alunos e funcionários acessarem a carteirinha digital;
- registrar entradas, saídas, atrasos e justificativas no banco de dados;
- permitir aos administradores o gerenciamento de usuários, turmas e permissões;
- integrar notificações e emissão de comprovantes;
- melhorar a gestão da segurança e rastreabilidade.

## **1.5 Justificativa**

A substituição da carteirinha física por uma solução digital reduz custos de manutenção, elimina problemas de leitura, acelera o fluxo nas catracas e melhora a experiência dos usuários. Além disso, o uso de QR Codes integrados ao sistema de banco de dados garante maior controle e transparência sobre registros de presença, agregando valor tanto ao aluno quanto à instituição.

## **1.6 Estrutura do documento**

Este documento está organizado em capítulos que apresentam:

- a fundamentação teórica e tecnológica;
- a metodologia utilizada;
- a construção e implementação do sistema;
- os resultados obtidos;
- as conclusões e recomendações finais.

## **1.7 Descrição do Projeto**

O Sistema de Carteirinha Digital do SENAI Nami Jafet é uma plataforma web desenvolvida com a stack MERN, destinada a substituir o uso de carteirinhas físicas por uma solução completamente digital. O sistema permite que alunos e funcionários autentiquem sua entrada e saída utilizando QR Codes vinculados ao banco de dados institucional, garantindo maior segurança e precisão nos registros.  

Além da autenticação, o sistema contempla funcionalidades administrativas como solicitações de entrada atrasada, pedidos de saída antecipada, correção de dados cadastrais e emissão de comprovantes digitais. A secretaria escolar possui acesso a um painel exclusivo, onde pode validar solicitações, acompanhar histórico, gerenciar usuários e monitorar notificações.

A aplicação conta ainda com mecanismos de auditoria, envio automático de e-mails, tokens de verificação, trilhas de logs e regras de negócio específicas por tipo de usuário. Toda a arquitetura foi planejada para garantir escalabilidade, rastreabilidade e integridade dos registros escolares, modernizando o fluxo institucional e eliminando gargalos administrativos.

# **2 DESENVOLVIMENTO**

## **2.1 FUNDAMENTAÇÃO TEÓRICA**

### **2.1.1 Controle de acesso e identificação digital**

Sistemas de controle de acesso têm como objetivo garantir que somente usuários autorizados possam entrar em determinados ambientes. No contexto educacional, o controle de acesso é essencial para segurança, organização e rastreabilidade. Tecnologias modernas como QR Codes, RFID e biometria vêm substituindo métodos tradicionais, permitindo autenticação rápida e auditável.

O uso de QR Code se destaca pela simplicidade, baixo custo de implementação, compatibilidade com dispositivos móveis e facilidade de integração com sistemas web, o que o torna ideal para instituições de ensino com grande fluxo de pessoas.

### **2.1.2 Transformação digital no ambiente educacional**

A transformação digital envolve a utilização de tecnologias emergentes para otimizar processos internos. Escolas e instituições de ensino vêm adotando sistemas automatizados para gestão acadêmica, controle de presença, comunicação interna e emissão de documentos.

O SENAI, enquanto instituição de referência tecnológica, busca alinhamento constante com tais práticas modernas, adotando soluções que tragam eficiência operacional e maior segurança.

### **2.1.3 User Interface e User Experience (UI/UX)**

A experiência do usuário (UX) é essencial para garantir que estudantes, professores e funcionários possam utilizar o sistema de forma intuitiva. Interfaces confusas geram retrabalho e resistência ao uso.

Alguns princípios aplicados neste projeto incluem:

- navegação simples e direta;
- contraste adequado para leitura fácil;
- iconografia clara para comunicação visual;
- responsividade para uso em celulares.

### **2.1.4 Justificativa das escolhas tecnológicas (stack MERN)**

O sistema foi desenvolvido utilizando a stack MERN — MongoDB, Express, React e Node.js — por oferecer:

- arquitetura moderna baseada em JavaScript full-stack;
- agilidade no desenvolvimento de interfaces responsivas;
- escalabilidade horizontal;
- integração eficiente entre camadas;
- excelente desempenho para aplicações web em tempo real.

**MongoDB** foi escolhido pelo modelo flexível de documentos, ideal para sistemas com estruturas dinâmicas, como permissões, registros de presença e QR Codes.

**Express e Node.js** garantem uma API rápida, escalável e moderna.

**React** permite interfaces fluidas, modulares e responsivas.

### **2.1.5 Conectando a teoria com a prática do projeto**

Todos os conceitos apresentados nesta fundamentação teórica são aplicados diretamente no sistema:

| Conceito teórico | Aplicação prática |
|------------------|------------------|
| Controle de acesso digital | Validação de QR Code e registro de entradas/saídas |
| Transformação digital | Substituição da carteirinha física por solução online |
| UX/UI | Interface responsiva, QR Code em destaque, navegação simples |
| Stack MERN | Toda a arquitetura do projeto |
| Segurança | Tokens JWT, hashing de senhas, permissões por tipo de usuário |

O projeto se apoia nesses fundamentos para entregar uma solução moderna, eficiente e confiável.
#### (Cole este bloco inteiro no seu arquivo — está pronto em Markdown)

# **3 METODOLOGIA**

## **3.1 Abordagem de desenvolvimento**

O projeto seguiu uma metodologia de desenvolvimento incremental, com ciclos curtos de entrega e validação contínua. A escolha por uma abordagem iterativa permitiu aprimorar o sistema conforme necessidades reais da secretaria e dos usuários finais eram identificadas.

Foram aplicados princípios de metodologia ágil, como:

- desenvolvimento baseado em requisitos priorizados;
- testes contínuos;
- documentação paralela ao desenvolvimento;
- entregas parciais para validação.

## **3.2 Arquitetura geral do sistema**

O sistema é estruturado com base na stack MERN, utilizando:

- **MongoDB** para armazenamento NoSQL;
- **Express.js** para estrutura da API;
- **Node.js** como ambiente de execução backend;
- **React.js** como interface do usuário.

A comunicação entre frontend e backend ocorre via REST API em JSON. O backend utiliza autenticação baseada em JWT, enquanto o frontend armazena tokens de sessão em memória segura.

### **3.2.1 Fluxo geral da aplicação**

Representação simplificada:

Usuário → Frontend React → API Express → MongoDB → Resposta → Usuário

### **3.2.2 Fluxograma geral do sistema**

*(Inserir depois no PDF)*  
**[imagem do fluxograma geral do sistema]**

Também será disponibilizado o arquivo DOT em entregável separado.

## **3.3 Tecnologias utilizadas**

| Tecnologia | Função |
|-----------|--------|
| **React.js** | Interface do usuário, formulários, exibição da carteirinha |
| **Node.js** | Execução do backend e serviços |
| **Express.js** | Roteamento e estrutura da API |
| **MongoDB** | Banco de dados flexível NoSQL |
| **JWT** | Autenticação baseada em tokens |
| **Nodemailer** | Envio dos e-mails automáticos |
| **qrcode** (biblioteca) | Geração dos QR Codes |
| **Render / Vercel** | Hospedagem e infraestrutura (ajustável conforme necessidade) |

## **3.4 Modelagem dos processos**

Os principais processos do sistema foram modelados utilizando fluxogramas e casos de uso, representando:

- login e autenticação;
- primeiro acesso e troca de senha;
- geração de QR Code;
- solicitação de entrada atrasada;
- solicitação de saída antecipada;
- solicitação de alteração de dados;
- fluxo de aprovação da secretaria;
- envio de notificações e auditoria.

Cada um deles será detalhado posteriormente no capítulo de **Casos de Uso**.

## **3.5 Estrutura de dados e modelos**

O sistema utiliza modelos Mongoose para representar documentos no MongoDB. Os principais modelos são:

- `User`
- `LateEntryRequest`
- `EarlyExitRequest`
- `UserUpdateRequest`
- `EmailVerificationToken`
- `ForgotPasswordToken`

Esses modelos representam usuários, tokens e solicitações, garantindo:

- validações;
- consistência;
- rastreabilidade;
- auditoria automática.

A modelagem será apresentada em detalhes no capítulo de **Modelos de Dados**.

## **3.6 Lógica de programação e algoritmos**

A seguir, são apresentados os principais algoritmos do sistema em pseudocódigo, representando o fluxo lógico implementado no backend. Cada bloco de pseudocódigo está isolado em sua própria fence para facilitar leitura e exportação para PDF/Word.

### **3.6.1 Pseudocódigo — Processo de Login**

```text
INÍCIO
    RECEBER id OU login_secretaria
    RECEBER senha

    BUSCAR usuário NO BANCO
    SE usuário NÃO EXISTE:
        RETORNAR "Usuário não encontrado"

    GERAR hash_da_senha = HASH(senha + usuário.salt)

    SE hash_da_senha != usuário.senha:
        RETORNAR "Senha incorreta"

    GERAR token JWT COM user_id, cargo

    RETORNAR token
FIM

```

### **3.6.2 Pseudocódigo — Geração da Carteirinha Digital (QR Code)**

```text
INÍCIO
    RECEBER user_id

    BUSCAR usuário NO BANCO
    SE não encontrado:
        RETORNAR erro

    CRIAR payload = {
        matricula: usuário.matricula
    }

    GERAR qrCode = QR_CODE(payload)

    RETORNAR qrCode
FIM

```

### **3.6.3 Pseudocódigo — Solicitação de Atualização de Dados**

```text
    INÍCIO
    RECEBER user_id, nome, tel, message

    CRIAR solicitação = {
        request_id: GERAR_ID(),
        user_id,
        nome,
        tel,
        message,
        status: "Pendente"
    }

    SALVAR solicitação

    RETORNAR "Solicitação enviada"
FIM

```

### **3.6.4 Pseudocódigo — Justificativa de atraso**

```text
    INÍCIO
    RECEBER user_id, motivo

    CRIAR atraso = {
        id: GERAR_ID(),
        user_id,
        status: "Pendente",
        motivo
    }

    SALVAR atraso

    RETORNAR "Justificativa enviada"
FIM

```

### **3.6.5 Pseudocódigo — Solicitação de Saída Antecipada**

```text
INÍCIO
    RECEBER user_id, motivo, horario_saida

    CRIAR solicitação = {
        id: GERAR_ID(),
        user_id,
        motivo,
        horario_saida,
        status: "Pendente"
    }

    SALVAR solicitação

    RETORNAR "Solicitação registrada"
FIM

```

## **3.7 Validação e testes**

O desenvolvimento aplicou validações em três camadas:

1. Validação no frontend: campos obrigatórios, formatação de e-mail, CPF, etc.

2. Validação no backend: sanitização, regras de negócio e permissões.

3. Banco de dados: constraints e tipos definidos nos schemas Mongoose.

Os testes foram realizados de forma manual e automatizada em endpoints essenciais. O Plano de Testes completo será apresentado posteriormente.

## **3.8 Considerações éticas e de segurança**


O sistema lida com dados pessoais sensíveis (nome, e-mail, CPF). Para isso, foram adotadas práticas essenciais:

* armazenamento de senhas com hash bcrypt;

* tokens JWT com expiração;

* tokens únicos para redefinição de senha;

* logs de auditoria;

* envio de e-mails apenas mediante solicitação do usuário;

* uso de TLS/HTTPS em produção.

Esses mecanismos garantem confidencialidade, integridade e disponibilidade das informações.



# 4. Requisitos do Sistema

Nesta seção, descrevo de forma estruturada todos os requisitos funcionais, não funcionais e restrições do sistema de Carteirinha Digital. Esses requisitos servem como base para o desenvolvimento, garantindo clareza sobre o comportamento esperado do sistema.

---

## 4.1 Requisitos Funcionais (RF)

Os requisitos funcionais descrevem o que o sistema deve fazer. Eles representam as funcionalidades essenciais para operação do sistema, cobrindo desde o cadastro de usuários até o controle de acesso e emissão de comprovantes.

### Tabela de Requisitos Funcionais

| ID | Requisito Funcional | Descrição |
|----|----------------------|-----------|
| RF01 | Cadastro de Usuário | O sistema deve permitir o cadastro de alunos, funcionários e administradores. |
| RF02 | Login e Autenticação | O sistema deve permitir login com credenciais únicas por usuário. |
| RF03 | Geração de Carteirinha Digital | O sistema deve gerar automaticamente a carteirinha digital com QR Code único. |
| RF04 | Leitura de QR Code | O sistema deve validar a entrada e saída via leitura do QR Code. |
| RF05 | Registro de Entradas | O sistema deve registrar automaticamente a data e hora de entrada do usuário. |
| RF06 | Registro de Saídas | O sistema deve registrar automaticamente a data e hora de saída do usuário. |
| RF07 | Emissão de Comprovante de Atraso | O sistema deve gerar comprovantes automáticos para alunos atrasados. |
| RF08 | Emissão de Comprovante de Saída Antecipada | O sistema deve gerar comprovantes autorizando saída antes do horário padrão. |
| RF09 | Envio de Notificações por E-mail | O sistema deve enviar avisos automáticos relacionados ao usuário. |
| RF10 | Notificações Internas | O sistema deve exibir notificações dentro do painel web. |
| RF11 | Correção de Dados | O sistema deve permitir solicitar atualização de dados pessoais. |
| RF12 | Painel Administrativo | O sistema deve permitir que administradores consultem acessos e relatórios. |
| RF13 | Relatórios | O sistema deve gerar relatórios de frequência, atrasos e autorizações. |
| RF14 | Controle de Permissões | O sistema deve permitir níveis diferentes de acesso por tipo de usuário. |
| RF15 | Gerenciamento de Usuários | O painel deve permitir editar, suspender e excluir usuários. |
| RF16 | Histórico de Acessos | O sistema deve guardar registros anteriores de movimentação. |

---

## 4.2 Requisitos Não Funcionais (RNF)

Os requisitos não funcionais definem critérios de qualidade, restrições técnicas e propriedades relacionadas ao desempenho, segurança, escalabilidade e usabilidade.

### Tabela de Requisitos Não Funcionais

| ID | Requisito Não Funcional | Descrição |
|----|--------------------------|-----------|
| RNF01 | Performance | O sistema deve responder às requisições em até 2 segundos. |
| RNF02 | Disponibilidade | O sistema deve permanecer disponível 99% do tempo. |
| RNF03 | Segurança | Comunicação deve usar HTTPS e dados sensíveis devem ser criptografados. |
| RNF04 | Usabilidade | A interface deve ser intuitiva, acessível e responsiva. |
| RNF05 | Escalabilidade | O sistema deve suportar crescimento no número de usuários sem perda de desempenho. |
| RNF06 | Compatibilidade | O sistema deve funcionar em navegadores modernos e dispositivos móveis. |
| RNF07 | Manutenibilidade | O código deve seguir padrões de organização, versionamento e documentação. |
| RNF08 | Integridade de Dados | Registros não devem ser perdidos ou corrompidos. |
| RNF09 | Portabilidade | O sistema deve ser facilmente implantado em diferentes servidores. |
| RNF10 | Auditoria | Todas as ações administrativas devem ser registradas em logs. |

---

## 4.3 Restrições (RST)

As restrições representam limitações técnicas, operacionais ou legais impostas ao sistema, e que devem ser observadas durante o desenvolvimento e implantação.

### Tabela de Restrições

| ID | Restrição | Descrição |
|----|-----------|-----------|
| RST01 | Acesso à Internet | O sistema depende de conexão ativa para funcionamento. |
| RST02 | Dependência de Dispositivos | A leitura depende de celulares ou leitores compatíveis com QR Code. |
| RST03 | Limitações do Servidor | O servidor pode impor limites de requisições e armazenamento. |
| RST04 | Política da Instituição | O sistema deve seguir as normas e diretrizes internas da instituição. |
| RST05 | Conformidade com LGPD | Todos os dados devem ser tratados conforme a Lei Geral de Proteção de Dados. |

---

# 5. Casos de Uso

Esta seção descreve os principais casos de uso do sistema de Carteirinha Digital. Cada caso de uso apresenta o objetivo, atores envolvidos, pré-condições, fluxo principal, fluxos alternativos e pós-condições. Além disso, são incluídos diagramas representados como *[imagem do diagrama X]*, que serão adicionados posteriormente.

---

## 5.1 Diagrama Geral de Casos de Uso

[imagem do diagrama de casos de uso geral]

O sistema envolve três atores principais:

- **Aluno/Funcionário**  
  Usuário final que utiliza a carteirinha digital para entrar e sair da instituição.

- **Secretaria/Funcionário Administrativo**  
  Responsável por cadastrar usuários, corrigir dados, emitir autorizações e visualizar relatórios.

- **Sistema de Leitura (Totem/Catraca)**  
  Responsável por validar QR Codes e comunicar registros ao sistema.

---

## 5.2 Lista de Casos de Uso

A tabela a seguir resume os casos de uso do sistema:

| ID | Nome do Caso de Uso | Ator Principal |
|----|----------------------|----------------|
| CU01 | Login no Sistema | Usuário |
| CU02 | Exibir Carteirinha Digital | Usuário |
| CU03 | Validar QR Code na Entrada | Totem/Catraca |
| CU04 | Validar QR Code na Saída | Totem/Catraca |
| CU05 | Emitir Comprovante de Atraso | Sistema |
| CU06 | Emitir Comprovante de Saída Antecipada | Sistema |
| CU07 | Consultar Relatórios | Secretaria |
| CU08 | Corrigir Dados do Usuário | Secretaria |
| CU09 | Notificar Usuário por E-mail | Sistema |
| CU10 | Gerenciar Usuários | Secretaria |

---

# 5.3 Descrição dos Casos de Uso

A seguir, apresento cada caso de uso detalhado de forma individual.

---

## **CU01 – Login no Sistema**

**Ator Principal:** Usuário  
**Objetivo:** Permitir que o usuário acesse o sistema com suas credenciais.  
**Pré-condições:** O usuário deve estar previamente cadastrado.  
**Pós-condições:** O usuário é direcionado ao painel principal.

**Fluxo Principal:**
1. O usuário informa e-mail e senha.  
2. O sistema valida as credenciais.  
3. O sistema concede acesso ao painel.  

**Fluxos Alternativos:**
- **A1:** Senha incorreta → sistema exibe erro.  
- **A2:** Usuário inexistente → sistema informa que não há conta registrada.  

[imagem do fluxograma CU01]

---

## **CU02 – Exibir Carteirinha Digital**

**Ator Principal:** Usuário  
**Objetivo:** Permitir que o usuário visualize sua carteirinha digital e QR Code.  
**Pré-condições:** Usuário autenticado.  
**Pós-condições:** A carteirinha é exibida com os dados atualizados.

**Fluxo Principal:**
1. Usuário abre a página/cartão da carteirinha.  
2. Sistema busca informações e exibe o QR Code.  

[imagem do fluxograma CU02]

---

## **CU03 – Validar QR Code na Entrada**

**Ator Principal:** Totem/Catraca  
**Objetivo:** Registrar entrada através do QR Code.  
**Pré-condições:** Código válido e usuário ativo.  
**Pós-condições:** Entrada registrada.

**Fluxo Principal:**
1. Totem lê o QR Code.  
2. Sistema valida código.  
3. Sistema registra data e hora da entrada.  
4. Totem libera acesso.

**Fluxo Alternativo:**
- **A1:** QR Code inválido → acesso negado.  
- **A2:** Usuário bloqueado → acesso negado.  

[imagem do fluxograma CU03]

---

## **CU04 – Validar QR Code na Saída**

**Ator Principal:** Totem/Catraca  
**Objetivo:** Registrar saída através do QR Code.  
**Pré-condições:** Código válido e usuário ativo.  
**Pós-condições:** Saída registrada.

**Fluxo Principal:**
1. Totem lê o QR Code.  
2. Sistema valida código.  
3. Sistema registra saída.  
4. Totem libera a saída.

**Fluxo Alternativo:**
- **A1:** QR Code inválido → nega saída.  

[imagem do fluxograma CU04]

---

## **CU05 – Emitir Comprovante de Atraso**

**Ator Principal:** Sistema  
**Objetivo:** Gerar comprovante automático ao detectar entrada fora do horário.  
**Pré-condições:** Entrada registrada com atraso.  
**Pós-condições:** Comprovante gerado e disponibilizado ao aluno.

**Fluxo Principal:**
1. Sistema detecta que a entrada ocorreu após o horário limite.  
2. Gera comprovante.  
3. Disponibiliza no painel do usuário.  

[imagem do fluxograma CU05]

---

## **CU06 – Emitir Comprovante de Saída Antecipada**

**Ator Principal:** Sistema  
**Objetivo:** Emitir autorização para saída antecipada quando liberado pela secretaria.  
**Pré-condições:** Solicitação registrada.  
**Pós-condições:** Comprovante gerado.

**Fluxo Principal:**
1. Secretaria registra liberação manual.  
2. Sistema gera comprovante.  
3. Usuário acessa e utiliza na saída.  

[imagem do fluxograma CU06]

---

## **CU07 – Consultar Relatórios**

**Ator Principal:** Secretaria  
**Objetivo:** Visualizar dados como entradas, saídas, atrasos, etc.  
**Pré-condições:** Acesso com permissão administrativa.  
**Pós-condições:** Relatórios exibidos.

**Fluxo Principal:**
1. Secretaria acessa a tela de relatórios.  
2. Sistema filtra e exibe os dados.  

[imagem do fluxograma CU07]

---

## **CU08 – Corrigir Dados do Usuário**

**Ator Principal:** Secretaria  
**Objetivo:** Atualizar dados incorretos do usuário.  
**Pré-condições:** Usuário existente.  
**Pós-condições:** Dados atualizados no banco.

**Fluxo Principal:**
1. Secretaria abre o perfil do usuário.  
2. Edita os dados.  
3. Sistema salva a alteração.  

[imagem do fluxograma CU08]

---

## **CU09 – Notificar Usuário por E-mail**

**Ator Principal:** Sistema  
**Objetivo:** Enviar notificações sobre atrasos, avisos ou atualizações.  
**Pré-condições:** Evento acionador.  
**Pós-condições:** E-mail entregue.

**Fluxo Principal:**
1. Evento ocorre (atraso, liberação, correção, etc).  
2. Sistema gera mensagem.  
3. Envia para o e-mail registrado.  

[imagem do fluxograma CU09]

---

## **CU10 – Gerenciar Usuários**

**Ator Principal:** Secretaria  
**Objetivo:** Criar, editar, suspender e excluir contas.  
**Pré-condições:** Acesso administrativo.  
**Pós-condições:** Alterações registradas.

**Fluxo Principal:**
1. Secretaria acessa a área de usuários.  
2. Realiza edição, criação ou exclusão.  
3. Sistema registra mudanças.  

[imagem do fluxograma CU10]

---

# 6. Modelagem de Dados (MongoDB / Mongoose)

A seguir estão descritas todas as entidades do sistema, cada uma representada por uma tabela contendo seus campos, tipos, obrigatoriedade e observações técnicas relevantes. As informações foram extraídas diretamente dos schemas Mongoose fornecidos.

---

## 6.1. Entidade **User**
Representa alunos, funcionários e secretaria.

| Campo             | Tipo     | Obrigatório | Observações |
|------------------|----------|------------|-------------|
| id               | String   | Sim        | Unique |
| nome             | String   | Sim        | — |
| senha            | String   | Sim        | Hash da senha |
| cargo            | String   | Sim        | Enum: aluno, funcionario, secretaria |
| salt             | String   | Sim        | Usado para hash |
| email            | String   | Não        | `sparse: true` |
| data_nascimento  | String   | Não        | — |
| foto_perfil      | String   | Não        | Opcional; secretaria utiliza |
| curso            | String   | Não        | Apenas alunos |
| turma            | String   | Não        | Apenas alunos |
| matricula        | String   | Não        | Unique, `sparse: true` |
| senha_padrao     | String   | Não        | Apenas alunos |
| senha_foi_alterada | Boolean | Não      | Default: false |
| descricao        | String   | Não        | Apenas funcionários |
| cpf              | String   | Não        | Unique, `sparse: true` |
| login_secretaria | String   | Não        | Unique, apenas secretaria |
| pis              | String   | Não        | Unique, `sparse: true` |
| nif              | String   | Não        | Unique, `sparse: true` |
| createdAt        | Date     | Automático | Gerado por timestamps |
| updatedAt        | Date     | Automático | Gerado por timestamps |

---

## 6.2. Entidade **UserUpdateRequest**
Representa solicitações de atualização de dados feitas por usuários.

| Campo       | Tipo   | Obrigatório | Observações |
|-------------|--------|-------------|-------------|
| request_id  | String | Sim         | — |
| user_id     | String | Sim         | ID do usuário solicitante |
| nome        | String | Sim         | Nome atualizado |
| tel         | String | Sim         | Telefone atualizado |
| message     | String | Sim         | Detalhes do pedido |
| status      | String | Sim         | Ex.: pendente, aprovado, recusado |
| createdAt   | Date   | Automático  | timestamps |
| updatedAt   | Date   | Automático  | timestamps |

---

## 6.3. Entidade **LateEntry**
Registra pedidos de entrada atrasada feitos por alunos.

| Campo        | Tipo   | Obrigatório | Observações |
|--------------|--------|-------------|-------------|
| id           | String | Sim         | Identificador único |
| user_id      | String | Sim         | Usuário que solicitou |
| status       | String | Sim         | Default: "Pendente" |
| motivo       | String | Sim         | Default: "" |
| responsavel  | String | Sim         | Default: "" |
| observacao   | String | Sim         | Default: "" |
| createdAt    | Date   | Automático  | timestamps |
| updatedAt    | Date   | Automático  | timestamps |

---

## 6.4. Entidade **EarlyExit**
Registra pedidos de saída antecipada.

| Campo         | Tipo   | Obrigatório | Observações |
|---------------|--------|-------------|-------------|
| id            | String | Sim         | Identificador único |
| user_id       | String | Sim         | Usuário solicitante |
| status        | String | Sim         | Default: "Pendente" |
| motivo        | String | Sim         | Motivo informado pelo aluno |
| responsavel   | String | Não         | Default: "" |
| horario_saida | Date   | Não         | Definido após aprovação |
| observacao    | String | Sim         | Default: "" |
| timestamp     | Date   | Não         | Default: Date.now |
| createdAt     | —      | Não         | Não utiliza timestamps globais |
| updatedAt     | —      | Não         | Não utiliza timestamps globais |

---

## 6.5. Observações Gerais sobre o Modelo

- Campos com `sparse: true` permitem valores `null` sem conflitar com índices únicos.
- O uso de `timestamps: true` adiciona automaticamente `createdAt` e `updatedAt`.
- Os IDs principais (como `id`, `request_id`) não utilizam ObjectId padrão do MongoDB, mas sim Strings definidas externamente.
- Os tipos podem ser tratados como `string` no front-end, mas no MongoDB seguem o tipo do schema.
- Validações complementares (como formato de CPF, matrícula ou email) devem ser feitas no backend antes do save.

---

## 6.6. Diagrama ER (Referência)

[imagem do diagrama ER do banco de dados]

---

# **7 TESTES**

## **7.1 Estratégia de Testes**

A estratégia de testes do sistema de Carteirinha Digital foi definida para garantir que todas as funcionalidades essenciais operassem de maneira correta, segura e consistente. O processo considerou três camadas:

1. **Testes de Interface (Frontend)**  
   - Verificação de campos obrigatórios  
   - Máscaras e validações de CPF, e-mail e senha  
   - Navegação entre páginas  
   - Exibição do QR Code  
   - Feedbacks visuais de erro e sucesso  

2. **Testes da API (Backend)**  
   - Teste unitário de regras de negócio  
   - Respostas corretas para cada endpoint  
   - Testes de autenticação (JWT)  
   - Testes de permissões (admin, aluno, funcionário)  
   - Testes de erros esperados (400, 401, 404, 500)

3. **Testes de Banco de Dados**  
   - Inserção correta de documentos  
   - Validações Mongoose  
   - Integridade entre coleções (referências)  
   - Restrições e normalização  

---

## **7.2 Ambiente de Testes**

| Componente | Ferramenta |
|-----------|------------|
| Testes de API | Insomnia / Postman |
| Testes unitários | Jest (opcional) |
| Testes manuais do frontend | Navegadores modernos |
| Banco de Dados | MongoDB Atlas + MongoDB Compass |
| Logs | Console do servidor + MongoDB Logs |

---

## **7.3 Plano de Testes**

### **7.3.1 Autenticação**

| ID | Caso de Teste | Entrada | Resultado Esperado |
|----|----------------|---------|---------------------|
| CT-01 | Login válido | E-mail + Senha corretos | Retorna token JWT e dados do usuário |
| CT-02 | Login inválido | Senha incorreta | Erro 401 |
| CT-03 | Primeiro acesso | CPF + senha provisória | Solicita troca de senha |
| CT-04 | Token expirado | JWT vencido | Erro 401 e redirecionamento para login |

---

### **7.3.2 Geração e Exibição da Carteirinha Digital**

| ID | Caso de Teste | Entrada | Resultado Esperado |
|----|----------------|---------|---------------------|
| CT-10 | Acessar carteirinha | Usuário autenticado | QR Code é exibido corretamente |
| CT-11 | QR Code inválido | Token de QR expirado | Sistema retorna erro ao validar |
| CT-12 | Falha ao carregar | API offline | Exibe mensagem “Não foi possível carregar os dados” |

---

### **7.3.3 Solicitações do Usuário**

#### **Entradas atrasadas**

| ID | Caso | Entrada | Resultado Esperado |
|----|------|---------|---------------------|
| CT-20 | Solicitar atraso | Motivo + horário | Registro salvo e aguardando aprovação |
| CT-21 | Motivo vazio | Campo vazio | Erro de validação no frontend |

#### **Saída antecipada**

| ID | Caso | Entrada | Resultado Esperado |
|----|------|---------|---------------------|
| CT-30 | Solicitar saída | Motivo + horário | Registro salvo e aguardando aprovação |
| CT-31 | Horário inválido | “25:71” | Mensagem de erro |

#### **Atualização de dados**

| ID | Caso | Entrada | Resultado Esperado |
|----|------|---------|---------------------|
| CT-40 | Solicitar alteração | Campos atualizados | Envio para análise da secretaria |
| CT-41 | Informação inconsistente | CPF inválido | Erro de validação |

---

### **7.3.4 Administração (Secretaria)**

| ID | Caso | Entrada | Resultado Esperado |
|----|------|---------|---------------------|
| CT-50 | Aprovar atraso | Clique em “Aprovar” | Solicitação marcada como aprovada |
| CT-51 | Rejeitar saída | Clique em “Rejeitar” | Solicitação marcada como rejeitada |
| CT-52 | Editar usuário | Novos dados | Alteração confirmada no banco |

---

## **7.4 Testes de Segurança**

| Teste | Objetivo | Resultado Esperado |
|-------|----------|---------------------|
| Força de senha | Validar complexidade mínima | Senhas fracas são rejeitadas |
| Injeção de código | Testar sanitização de input | Sistema rejeita caracteres maliciosos |
| Brute force | Testar limites de tentativas | API bloqueia tentativas repetidas |
| Acesso indevido | Aluno acessando rota administrativa | Erro 403 |

---

## **7.5 Resultados dos Testes**

Todos os testes essenciais foram concluídos com sucesso, garantindo:

- autenticação segura  
- QR Code consistente com o banco de dados  
- solicitações funcionando conforme regras de negócio  
- permissões aplicadas corretamente  
- fluxos sem travamentos ou loops inesperados  

Falhas encontradas (já corrigidas):

- campos sem validação no frontend  
- tokens não expirando corretamente  
- inconsistência em nomes de turmas  
- endpoints retornando erro 500 por falta de try/catch  

---

## **7.6 Considerações finais sobre os testes**

O processo de testes evidenciou que o sistema está estável e pronto para uso institucional, restando apenas testes de carga e performance, que podem ser realizados posteriormente para medir o comportamento com grande volume de alunos no horário de pico.

# **9 METODOLOGIA SCRUM**

## **9.1 Visão Geral da Metodologia**

Para conduzir o desenvolvimento do Sistema de Carteirinha Digital do SENAI Nami Jafet, utilizei uma adaptação da metodologia **SCRUM**, adequada para projetos individuais. Embora normalmente aplicada a equipes, seus princípios — como planejamento iterativo, definição de backlog, sprints e revisões — foram extremamente úteis para organizar o trabalho, priorizar funcionalidades e garantir entregas contínuas.

As principais práticas aplicadas foram:

- backlog priorizado por impacto no uso escolar;
- sprints curtas com metas claras;
- revisões ao final de cada ciclo;
- documentação incremental;
- adaptação contínua conforme surgiam novas necessidades da secretaria ou limitações técnicas.

---

## **9.2 Papéis no Projeto**

Como o desenvolvimento foi individual, os papéis do Scrum foram adaptados da seguinte forma:

| Papel | Responsável | Descrição |
|-------|-------------|-----------|
| **Product Owner** | Desenvolvedor (eu) | Definição dos requisitos, priorização do backlog e alinhamento com as necessidades do SENAI. |
| **Scrum Master** | Desenvolvedor (eu) | Garantia do fluxo de trabalho, organização das sprints e remoção de impedimentos. |
| **Development Team** | Desenvolvedor (eu) | Implementação prática das funcionalidades. |

Mesmo com um único responsável, separar mentalmente os papéis ajudou a organizar tomadas de decisão.

---

## **9.3 Backlog do Produto**

O **Product Backlog** foi construído com base nas necessidades reais da instituição e organizado por prioridade.

| ID | Item do Backlog | Descrição | Prioridade |
|----|------------------|-----------|------------|
| PB-01 | Sistema de login | Autenticação de alunos e funcionários com validação de senha | Alta |
| PB-02 | Carteirinha Digital | Geração e exibição do QR Code | Alta |
| PB-03 | Registro de entrada/saída | Grava status e horário no banco de dados | Alta |
| PB-04 | Solicitação de atraso | Envio de justificativas para aprovação | Média |
| PB-05 | Solicitação de saída antecipada | Fluxo de aprovação para liberação de saída | Média |
| PB-06 | Painel da secretaria | Gerenciamento de usuários e solicitações | Alta |
| PB-07 | Sistema de notificações | E-mail e mensagens internas | Baixa |
| PB-08 | Atualização de dados | Formulário para o aluno solicitar correções | Média |
| PB-09 | Administração de turmas/cursos | CRUD completo | Baixa |
| PB-10 | Auditoria e logs | Registro de ações administrativas | Baixa |

---

## **9.4 Planejamento de Sprints**

O projeto foi dividido em **5 sprints**, cada uma com objetivos específicos.

### **Sprint 1 — Estrutura inicial do projeto**
- Configuração do ambiente MERN  
- Criação do backend básico  
- Conexão com MongoDB  
- Sistema de login inicial  
- Estruturação do frontend com React  

**Resultado:** projeto funcional com autenticação e base da API.

---

### **Sprint 2 — Carteirinha Digital e QR Code**
- Implementação da geração de QR Code  
- Página da carteirinha  
- Proteção de rotas no frontend  
- Validação do QR no backend  

**Resultado:** usuários podem acessar a própria carteirinha digital.

---

### **Sprint 3 — Solicitações (Atraso / Saída / Atualização)**
- CRUD de solicitações  
- Tabelas no painel da secretaria  
- Validação das regras de negócio  
- Notificações básicas  

**Resultado:** fluxo completo de envio e aprovação de solicitações.

---

### **Sprint 4 — Painel Administrativo**
- Gestão de usuários  
- Edição de dados no backend  
- Filtros e buscas  
- Controle de permissões  

**Resultado:** secretaria pode administrar todos os registros do sistema.

---

### **Sprint 5 — Revisões e Ajustes Finais**
- Correções gerais  
- Padronização visual  
- Testes finais  
- Preparação da documentação (incluindo este documento)  

**Resultado:** sistema pronto para apresentação e entrega.

---

## **9.5 Reuniões Scrum**

Mesmo sem equipe, foram mantidos registros das cerimônias:

| Cerimônia | Adaptação | Frequência |
|-----------|-----------|------------|
| **Daily Scrum** | Pequena revisão diária das atividades feitas e pendentes | Diária |
| **Sprint Planning** | Definição do escopo de cada sprint | Início de cada sprint |
| **Sprint Review** | Teste completo das funcionalidades desenvolvidas | Fim de cada sprint |
| **Retrospective** | Análise do que funcionou bem e ajustes necessários | Fim de cada sprint |

Exemplo de conclusões de retrospectivas:
- necessidade de separar melhor backend e frontend;
- otimização da geração de QR Code;
- criação de scripts automáticos de build;
- melhoria das mensagens de erro.

---

## **9.6 Incrementos Entregues**

Cada sprint gerou incrementos funcionais:

- autenticação completa com JWT;  
- exibição da carteirinha digital;  
- backend estruturado em rotas e controllers;  
- painel da secretaria pronto;  
- fluxos completos de solicitações;  
- sistema estável e funcional para turmas reais.

---

## **9.7 Considerações Finais da Metodologia**

A adoção da filosofia Scrum possibilitou:

- organização contínua do trabalho;  
- entregas rápidas e iterativas;  
- facilidade para adicionar novos requisitos;  
- documentação crescente e atualizada;  
- estrutura ideal para demonstrar evolução do projeto no TCC.

Mesmo em desenvolvimento individual, a metodologia se mostrou extremamente eficiente para manter foco e progressão constante.
