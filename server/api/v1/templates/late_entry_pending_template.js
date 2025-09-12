export const late_entry_pending_email_template = (nome, qrCode) => {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aviso de Atraso</title>
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
            padding: 20px 0;
            text-align: center;
            color: white;
        }

        .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }

        .email-content {
            padding: 40px;
        }

        .greeting {
            font-size: 18px;
            margin-bottom: 25px;
            color: #444444;
        }

        .message {
            margin-bottom: 20px;
            font-size: 16px;
        }

        .highlight {
            color: #e30613;
            font-weight: 600;
        }

        .action-box {
            background-color: #f9f2f3;
            border-left: 4px solid #e30613;
            padding: 20px;
            margin: 30px 0;
            border-radius: 0 4px 4px 0;
        }

        .qr-section {
            text-align: center;
            margin: 40px 0;
        }

        .qr-code {
            width: 180px;
            height: 180px;
            margin: 0 auto 15px;
            border: 1px solid #eeeeee;
            padding: 10px;
            border-radius: 4px;
        }

        .qr-text {
            font-size: 18px;
            font-weight: 600;
            color: #e30613;
            letter-spacing: 1px;
        }

        .instructions {
            font-size: 15px;
            margin-top: 30px;
            color: #555555;
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

        .divider {
            height: 1px;
            background-color: #eeeeee;
            margin: 25px 0;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
        </div>

        <div class="email-content">
            <p class="greeting">Olá, ${nome}</p>

            <p class="message">Você solicitou um registro de atraso.</p>

            <div class="action-box">
                <p>Você deve comparecer imediatamente à <strong>Secretaria</strong> para regularizar sua situação.</p>
            </div>

            <p class="message">Apresente o código abaixo para obter seu <strong>Comprovante de Redirecionamento</strong> e seguir para a aula.</p>

            <div class="qr-section">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCode}" alt="QR Code" class="qr-code">
                <div class="qr-text">${qrCode}</div>
            </div>

            <div class="divider"></div>

            <p class="instructions">Caso tenha dúvidas ou precise de assistência, procure imediatamente a secretaria da unidade.</p>
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