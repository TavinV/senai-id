const api_url = 'http://localhost:3000';

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
        const resposta = await axios.get(`${api_url}/carteirinha/users/fotoperfil/`, {
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
        const resposta = await axios.get(`${api_url}/carteirinha/users/access`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const urlImagem = resposta.data.url

        document.getElementById('access-qr').src = urlImagem;

    } catch (erro) {
        document.getElementById('access-qr').src = '../../img/404_image.jpg';

        console.error("Erro ao carregar a foto:", erro);
    }
}

async function carregarCarteirinha() {
    const token = localStorage.getItem('senai-id-token')
    if (!token) {
        window.location.href = '../../index.html'
    }

    axios.get(`${api_url}/carteirinha/users/`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(function (resposta) {
            console.log(resposta)
            const { id, curso, data_nascimento, matricula, nome, rg } = resposta.data.user
            document.getElementById("nome").innerHTML = nome;

            document.getElementById("rg").innerHTML = rg;
            document.getElementById("data_nascimento").innerHTML = data_nascimento;
            document.getElementById("matricula").innerHTML = matricula;
            document.getElementById("curso").innerHTML = curso;

            // Buscando a foto de perfil
            carregarFoto(token)
            carregarQRCode(token)

        }).catch((erro) => {
            if (erro.status === 404) {
                window.location.href = '../error/notfound.html'
            }
            if (erro.status === 400) {
                window.location.href = '../error/notfound.html'
            }
            if (erro.status === 403) {
                window.location.href = '../error/forbidden.html';
            }
        })

}

function reroute() {
    const paginasDosCargos = {
        aluno: '../access/carteirinha.html',
        funcionario: '../employees-access/carteirinha.html',
        secretaria: '../register/register.html',
        erro_servidor: '../error/servererror.html'
    }

    const token = localStorage.getItem('senai-id-token')
    axios.get(`${api_url}/rerouter`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(function (resposta) {
            const cargo = resposta.data.cargo
            const url = paginasDosCargos[cargo]

            if (cargo != "aluno") {
                window.location.href = url
            }
        }).catch((erro) => {
            // Usuário não está conectado, mantemos ele na página de login.
            if (erro.status != 500) {
                return
            } else {
                window.location.href = paginasDosCargos.erro_servidor
            }
        })
}

window.addEventListener('load', function () {
    reroute()
    carregarCarteirinha();
});

