// const fake_db_url = 'http://localhost:3000'

const nome = document.getElementById('nome');
const rg = document.getElementById('rg');
const dataNascimento = document.getElementById('data_nascimento');
const curso = document.getElementById('curso');
const matricula = document.getElementById('matricula');
const carteirinha_pfp = document.getElementById('carteirinha-pfp');


async function carregarCarteirinha() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        console.log(id);

        console.log(document.cookie)

        // Fetch para obter informações do usuário
        const resposta = await fetch(`http://localhost:3000/carteirinha/users/1`, { credentials: 'include' });
        const teste_cookies = await fetch(`http://localhost:3000/test-cookie`, { credentials: "include" })
        if (!resposta.ok) {
            throw new Error("Erro ao buscar informações do usuário.");
        }
        const dados = await resposta.json();
        const user = dados.user;

        nome.innerHTML = user.nome;
        rg.innerHTML = user.rg;
        dataNascimento.innerHTML = user.data_nascimento;
        curso.innerHTML = user.curso;
        matricula.innerHTML = user.matricula;

        // Fetch para obter a imagem de perfil como Blob
        const imagemResposta = await fetch(`http://localhost:3000/carteirinha/users/${id}/profile-image`);
        const imagemBlob = await imagemResposta.blob();

        // Converte o Blob para uma URL usando FileReader
        const reader = new FileReader();
        reader.onload = function (e) {
            carteirinha_pfp.innerHTML = `<img src="${e.target.result}" alt="Imagem de perfil" />`;
        };
        reader.readAsDataURL(imagemBlob);

    } catch (error) {
        console.log(error);
    }
}


window.addEventListener('load', function () {
    carregarCarteirinha();
});

