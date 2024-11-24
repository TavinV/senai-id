const api_url = 'http://localhost:3000';
const form = document.querySelector('form');

function encerrarSessao() {
    localStorage.removeItem('senai-id-token')
}


const redirecionamentos = {
    aluno: 'pages/access/carteirinha.html',
    funcionario: 'pages/employees-access/carteirinha.html',
    secretaria: 'pages/register/register.html',
    erro_servidor: 'pages/error/servererror.html',
}

function reroute() {

    const token = localStorage.getItem('senai-id-token')
    axios.get(`${api_url}/api/rerouter`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(function (resposta) {
            const cargo = resposta.data.cargo
            const url = redirecionamentos[cargo]
            window.location.href = url
        }).catch((erro) => {
            // Usuário não está conectado, mantemos ele na página de login.
            if (erro.status != 500) {
                return
            } else {
                window.location.href = redirecionamentos.erro_servidor
            }
        })
}
reroute()

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const login = document.getElementById('login').value.trim();
    const senha = document.getElementById('senha').value.trim();

    axios.post(`${api_url}/api/login`, { login: login, senha: senha })
        .then(function (resposta) {
            console.log(resposta)
            const cargo = resposta.data.cargo
            const urlRedirect = redirecionamentos[cargo];
            console.log(urlRedirect)
            if (resposta.status == 200 && urlRedirect) {
                console.log("Redirect")
                localStorage.setItem('senai-id-token', resposta.data.token);
                window.location.href = urlRedirect
            }
        })
        .catch(function (erro) {
            console.log(erro)
            document.getElementById('mensagem-erro').innerHTML = "Usuário e(ou) senha incorretos!"
        })
    // console.log(response)
});
