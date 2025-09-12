export const late_entry_approved_email_template = (nome, turma, horarioValidado, autorizadoPor, motivo) => {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atraso Validado</title>
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
            color: #e30613;
            font-size: 24px;
            margin-bottom: 25px;
            font-weight: 600;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 15px;
        }
        .message {
            margin-bottom: 25px;
            font-size: 16px;
        }
        .info-container {
            margin: 30px 0;
        }
        .info-row {
            margin: 15px 0;
            font-size: 16px;
        }
        .info-label {
            font-weight: 500;
        }
        .info-value {
            color: #e30613;
            font-weight: 600;
        }
        .divider {
            height: 1px;
            background-color: #eeeeee;
            margin: 25px 0;
        }
        .instructions {
            font-size: 15px;
            color: #555555;
            margin-bottom: 10px;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #777777;
        }
        .footer-logo {
            width: 120px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header"></div>
        <div class="email-content">
            <h1 class="email-title">Atraso Validado</h1>
            <p class="greeting">Olá, ${nome}</p>
            <p class="message">Seu atraso foi validado e você está autorizado a seguir para a sua aula.</p>
            
            <div class="info-container">
                <div class="info-row">
                    <span class="info-label">Turma:</span> <span class="info-value">${turma}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Horário:</span> <span class="info-value">${horarioValidado}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Autorizado por:</span> <span class="info-value">${autorizadoPor}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Motivo:</span> <span class="info-value">${motivo}</span>
                </div>
            </div>
            
            <div class="divider"></div>
            
            <p class="instructions">Apresente este e-mail ao professor para que sua entrada seja liberada.</p>
            <p class="instructions">Caso tenha dúvidas, procure a secretaria.</p>
        </div>
        <div class="footer">
            <p>SENAI - Serviço Nacional de Aprendizagem Industrial</p>
            <p>Este é um e-mail automático, por favor não responda</p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/8c/SENAI_São_Paulo_logo.png" alt="Logo SENAI" class="footer-logo">
        </div>
    </div>
</body>
</html>`;

    return html;
};