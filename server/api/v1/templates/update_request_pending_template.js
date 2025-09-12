export const update_request_email_template = (request_id, request_message, user_name) => {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Recebido</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
            color: #333333;
            line-height: 1.6;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            background-color: #e30613;
            height: 20px;
        }

        .email-content {
            padding: 40px;
        }

        .email-title {
            color: #333333;
            font-size: 24px;
            margin-bottom: 25px;
            font-weight: 600;
        }

        .message {
            margin-bottom: 20px;
            font-size: 16px;
        }

        .highlight {
            color: #e30613;
            font-weight: 600;
        }

        .request-info {
            margin: 30px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 4px;
        }

        .request-id {
            font-size: 16px;
            margin-bottom: 10px;
        }

        .user-name {
            font-size: 16px;
            margin-bottom: 15px;
        }

        .request-message {
            font-style: italic;
            padding: 15px;
            background-color: #f9f9f9;
            border-left: 3px solid #e30613;
            margin: 20px 0;
        }

        .divider {
            height: 1px;
            background-color: #eeeeee;
            margin: 25px 0;
        }

        .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #777777;
        }

        .logo {
            width: 120px;
            margin-top: 15px;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header"></div>

        <div class="email-content">
            <h1 class="email-title">Recebemos seu pedido de correção</h1>

            <p class="message">
                Nós já recebemos seu pedido de atualização de dados. No momento seu pedido está em <span class="highlight">análise</span>. Assim que houver alguma novidade, iremos te notificar por aqui e pelo site!
            </p>

            <div class="request-info">
                <div class="request-id"><strong>Pedido:</strong> #${request_id}</div>
                <div class="user-name"><strong>Nome:</strong> ${user_name}</div>
            </div>

            <div class="divider"></div>

            <h3>Mensagem:</h3>
            <div class="request-message">${request_message}</div>
        </div>

        <div class="footer">
            <p>SENAI - Serviço Nacional de Aprendizagem Industrial</p>
            <p>Este é um e-mail automático, por favor não responda</p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/8c/SENAI_São_Paulo_logo.png" alt="Logo SENAI" class="logo">
        </div>
    </div>
</body>
</html>`;

    return html;
};