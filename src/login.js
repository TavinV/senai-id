const api_url = 'http://localhost:3000/login';
const form = document.querySelector('form');

function encerrarSessao() {
    localStorage.removeItem('senai-id-token')
}

async function verificar_acesso(token){
    if (!token) {
        return
    }

    axios.get(`http://localhost:3000/inicio`, { headers: { 'Authorization': `Bearer ${token}` } })
    .then(function(resposta){
        console.log(resposta)
        const url = resposta.data.url

        if (resposta.status == 200 && url) {
            localStorage.setItem('senai-id-token', resposta.data.token);
            window.location.href = url
        }
    }).catch((erro) => {
        console.log(erro)
    })
} 

verificar_acesso(localStorage.getItem('senai-id-token'))

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const login = document.getElementById('login').value.trim();
    const senha = document.getElementById('senha').value.trim();

    axios.post(api_url, { login: login, senha: senha })
        .then(function (resposta) {
            const url = resposta.data.url

            if (resposta.status == 200 && url) {
                localStorage.setItem('senai-id-token', resposta.data.token);
                window.location.href = url
            }
        })
        .catch(function (erro) {
            document.getElementById('mensagem-erro').innerHTML = "Usuário e(ou) senha incorretos!"
        })

});
