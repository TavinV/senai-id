export const early_exit_approved_template = (request_id, user_name, reason, authorized_by, exit_time, observation = '') => {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saída Antecipada Aprovada</title>
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

        .request-details {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            border: 1px solid #e0e0e0;
        }

        .detail-item {
            display: flex;
            margin-bottom: 12px;
            align-items: flex-start;
        }

        .detail-item.full-width {
            flex-direction: column;
        }

        .detail-label {
            font-weight: 600;
            min-width: 150px;
            color: #555;
        }

        .detail-value {
            flex: 1;
        }

        .detail-value-box {
            padding: 12px;
            background-color: #f9f9f9;
            border-radius: 4px;
            margin-top: 8px;
            border-left: 3px solid #e30613;
            font-style: italic;
        }

        .observation-box {
            padding: 12px;
            background-color: #f0f8ff;
            border-radius: 4px;
            margin-top: 8px;
            border-left: 3px solid #1e90ff;
            font-style: italic;
        }

        .status-approved {
            color: #28a745;
            font-weight: 600;
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
            <h1 class="email-title">Saída Antecipada Aprovada</h1>

            <p class="message">
                Seu pedido de saída antecipada foi <span class="highlight">aprovado</span>.
            </p>

            <div class="request-details">
                <div class="detail-item">
                    <span class="detail-label">Número do Pedido:</span>
                    <span class="detail-value">#${request_id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Solicitante:</span>
                    <span class="detail-value">${user_name}</span>
                </div>
                <div class="detail-item full-width">
                    <span class="detail-label">Motivo:</span>
                    <div class="detail-value-box">${reason}</div>
                </div>
                ${observation ? `
                <div class="detail-item full-width">
                    <span class="detail-label">Observação:</span>
                    <div class="observation-box">${observation}</div>
                </div>
                ` : ''}
                <div class="detail-item">
                    <span class="detail-label">Responsável:</span>
                    <span class="detail-value">${authorized_by}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Horário de Saída:</span>
                    <span class="detail-value">${exit_time}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value status-approved">Aprovado</span>
                </div>
            </div>

            <div class="divider"></div>

            <p class="message">
                Apresente este e-mail na portaria para realizar sua saída.
            </p>
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