export const rejected_request_email_template = (request_id, user_name, rejection_reason) => {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Recusado</title>
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

        .rejection-reason {
            font-size: 16px;
            margin: 15px 0;
            padding: 15px;
            background-color: #f9f2f3;
            border-left: 4px solid #e30613;
            border-radius: 0 4px 4px 0;
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
            <h1 class="email-title">Comunicação sobre seu pedido de atualização</h1>

            <p class="message">Prezado(a) ${user_name},</p>

            <p class="message">Após uma análise criteriosa, informamos que seu pedido de atualização de dados não pôde ser atendido neste momento.</p>

            <div class="request-info">
                <div class="request-id"><strong>Pedido:</strong> #${request_id}</div>
            </div>

            <div class="rejection-reason">
                <strong>Motivo da recusa:</strong> ${rejection_reason}
            </div>

            <div class="divider"></div>

            <p class="message">Caso necessite de mais informações ou deseje submeter um novo pedido, estamos à disposição para auxiliá-lo.</p>

            <p class="message">Atenciosamente,<br>Equipe de Suporte</p>
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