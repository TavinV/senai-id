const api_url = 'http://localhost:3000/login';
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const login = document.getElementById('login').value.trim();
    const senha = document.getElementById('senha').value.trim();

    fetch(`${api_url}?login=${login}&senha=${senha}`)
        .then(resposta => {
            if (resposta.status === 401) {
                document.getElementById('mensagem-erro').innerHTML = "Usuário e(ou) senha incorretos!";
                return null; // Retorna null se a resposta for 401
            }
            return resposta.json(); // Retorna a resposta JSON se a autenticação for bem-sucedida
        })
        .then(dados => {
            if (dados) { // Verifica se dados não são null
                console.log(dados);
                window.location.href = dados.url; // Redireciona para a URL recebida
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});
