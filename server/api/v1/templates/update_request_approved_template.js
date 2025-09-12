export const approved_request_email_template = (request_id, user_name) => {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Aprovado</title>
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
            margin-bottom: 5px;
        }

        .confirmation {
            color: #333333;
            font-weight: 600;
            font-size: 16px;
            margin-top: 30px;
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
            <h1 class="email-title">Seu pedido de correção foi <span class="highlight">aprovado</span>!</h1>

            <p class="message">
                Temos boas notícias! Seu pedido de atualização de dados foi <b>aceito</b> e as
                alterações já foram aplicadas ao nosso sistema. Se precisar de mais alguma modificação, fique à vontade
                para entrar em contato.
            </p>

            <div class="divider"></div>

            <div class="request-info">
                <div class="request-id"><strong>Pedido:</strong> #${request_id}</div>
                <div class="user-name"><strong>Nome:</strong> ${user_name}</div>
            </div>

            <div class="confirmation">
                Os dados foram atualizados com sucesso.
            </div>
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