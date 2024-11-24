// const fake_db_url = 'http://localhost:3000'
const api_url = `http://localhost:3000`

const nome = document.getElementById('nome');
const rg = document.getElementById('rg');
const dataNascimento = document.getElementById('data_nascimento');
const curso = document.getElementById('curso');
const matricula = document.getElementById('matricula');
const carteirinha_pfp = document.getElementById('carteirinha-pfp');

function encerrarSessao() {
    localStorage.removeItem('senai-id-token')
    window.location.href = '../../index.html'
}

async function carregarFoto(token) {
    try {
        const resposta = await axios.get(`${api_url}/api/carteirinha/me/fotoperfil`, {
            responseType: 'blob',  // Define que a resposta será um blob (arquivo binário),
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const urlImagem = URL.createObjectURL(resposta.data);

        document.getElementById('carteirinha-pfp').src = urlImagem;

    } catch (erro) {
        document.getElementById('carteirinha-pfp').src = '../../img/404_image.jpg';

        console.error("Erro ao carregar a foto:", erro);
    }
}

async function carregarQRCode(token) {
    try {
        const resposta = await axios.get(`${api_url}/carteirinha/me/access`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const urlImagem = resposta.data.url

        document.getElementById('access-qr').src = urlImagem;

    } catch (erro) {
        document.getElementById('access-qr').src = '../../img/404_image.jpg';

        console.error("Erro ao carregar a foto:", erro);
    }
}


function reroute() {
    const paginasDosCargos = {
        aluno: '../access/carteirinha.html',
        funcionario: '../employees-access/carteirinha.html',
        secretaria: '../register/register.html',
        erro_servidor: '../error/servererror.html'
    }

    const token = localStorage.getItem('senai-id-token')
    axios.get(`${api_url}/api/rerouter`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(function (resposta) {
            const cargo = resposta.data.cargo
            const url = paginasDosCargos[cargo]

            if (cargo != "funcionario") {
                window.location.href = url
            }
        }).catch((erro) => {
            // Usuário não está conectado, mantemos ele na página de login.
            if (erro.status != 500) {
                window.location.href = '../../index.html'
            } else {
                window.location.href = paginasDosCargos.erro_servidor
            }
        })
}

function carregarInfo() {
    const token = localStorage.getItem('senai-id-token')
    axios.get(`${api_url}/api/carteirinha/me`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(function (resposta) {
            const { id, nome, cpf, descricao, nif, pis } = resposta.data.user

            document.getElementById('nome').innerText = nome
            document.getElementById('cpf').innerText = cpf
            document.getElementById('descricao').innerText = descricao
            document.getElementById('nif').innerText = nif
            document.getElementById('pis').innerText = pis

            carregarFoto(token)
            carregarQRCode(token)
        })
}

window.addEventListener('load', function () {
    reroute()
    carregarInfo()
});

