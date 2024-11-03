// const fake_db_url = 'http://localhost:3000'

const nome = document.getElementById('nome');
const rg = document.getElementById('rg');
const dataNascimento = document.getElementById('data_nascimento');
const curso = document.getElementById('curso');
const matricula = document.getElementById('matricula');
const carteirinha_pfp = document.getElementById('carteirinha-pfp');

async function carregarFoto(id) {
    try {
        const resposta = await axios.get(`http://localhost:3000/carteirinha/userfotoperfil/${id}`, {
            responseType: 'blob'  // Define que a resposta será um blob (arquivo binário)
        });

        const urlImagem = URL.createObjectURL(resposta.data);

        document.getElementById('carteirinha-pfp').src = urlImagem;

    } catch (erro) {
        if (erro.response && erro.response.status === 404) {
            document.getElementById('carteirinha-pfp').src = '../../img/404_image.jpg';
        } else {
            console.error("Erro ao carregar a foto:", erro);
        }
    }
}


async function carregarCarteirinha() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');


    axios.get(`http://localhost:3000/carteirinha/users/${id}`, { withCredentials: true })
        .then(function (resposta) {
            const { curso, data_nascimento, matricula, nome, rg } = resposta.data.user
            document.getElementById("nome").innerHTML = nome;

            document.getElementById("rg").innerHTML = rg;
            document.getElementById("data_nascimento").innerHTML = data_nascimento;
            document.getElementById("matricula").innerHTML = matricula;
            document.getElementById("curso").innerHTML = curso;

            // Buscando a foto de perfil

            carregarFoto(id)

        }).catch((erro) => {
            if (erro.status === 404) {
                window.location.href = '../error/notfound.html'
            }
        })

}


window.addEventListener('load', function () {
    carregarCarteirinha();
});

