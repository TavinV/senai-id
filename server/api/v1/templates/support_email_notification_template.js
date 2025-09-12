export const support_email_notification_template = (user_name, tel, message) => {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Montserrat', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 800px;
                margin: 20px auto;
                background: #ffffff;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                padding: 20px;
            }
            .email-header {
                background-color: #007bff;
                color: white;
                padding: 15px;
                text-align: center;
                font-size: 1.5rem;
                font-weight: 600;
            }
            .email-body {
                padding: 30px 20px;
                text-align: left;
                color: black;
            }
            .email-body h2 {
                font-size: 1.5rem;
                margin-bottom: 20px;
            }
            .email-body p {
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 10px;
            }
            .email-footer {
                text-align: center;
                padding: 15px;
                font-size: 14px;
                color: #777777;
                background-color: #f9f9f9;
            }
            .highlight {
                font-weight: 600;
                color: #007bff;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">Nova Mensagem de Suporte</div>
            <div class="email-body">
                <h2>Detalhes do Contato</h2>
                <p><b>Nome:</b> ${user_name}</p>
                <p><b>Telefone:</b> <a>${tel}</a> </p>
                <h2>Mensagem</h2>
                <p>${message}</p>
            </div>
            <div class="email-footer">
                <p>Este e-mail foi gerado automaticamente pelo sistema de suporte.</p>
            </div>
        </div>
    </body>
</html>`;

    return html;
};
