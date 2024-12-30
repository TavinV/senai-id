const cadastroForm = document.getElementById('cadastroForm')
const nome = document.getElementById('nome');
const rg = document.getElementById('rg');
const dataNascimento = document.getElementById('data_nascimento');
const curso = document.getElementById('curso');
const matricula = document.getElementById('matricula');
const carteirinha_pfp = document.getElementById('foto-aluno');
const horario_entrada = document.getElementById("horario_entrada")
const turma = document.getElementById("turma");

let popup = document.querySelector('.popup');

function fecharPopup() {
    popup.classList.toggle("active");
}

function showPopup(Type, content) {
    popup.classList.add("active")

    switch (Type) {
        case "loading":
            document.querySelector(".popup .loading").classList.toggle("active")
            break;
        case "success":
            document.querySelector(".popup .success").classList.toggle("active")
            document.querySelector(".popup .success h2").innerText = content.msg
            document.querySelector(".popup .success a").href = `../first-access/teste.html?id=${content.UID}`
            break;
        case "error":
            document.querySelector(".popup .error").classList.toggle("active")
            document.querySelector(".popup .error h3").innerText = content.msg
        default:
            break;
    }
}


async function registerUser(formData) {
    const token = localStorage.getItem('senai-id-token')

    showPopup("loading")

    try {
        const resposta = await axios.post('http://localhost:3000/api/secretaria/registrar/aluno', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data' // Necessário para enviar arquivos
            }
        });
        console.log(resposta)
        if (resposta.status == 201) {
            fecharPopup()
            showPopup("success", { msg: resposta.data.msg, UID: resposta.data.UID_aluno })
            cadastroForm.reset()
        }

    } catch (error) {

        console.log(error.response.data)
        if (error.response && error.response.status === 403) {
            window.location.href = '../error/forbidden.html';
        } else {
            fecharPopup()
            showPopup("error", { msg: error.response.data.error })
            console.error('Erro ao registrar usuário:', error);
        }
    }
}

function formatarNomeERg(nome, rg) {
    // Remove acentos do nome
    const nomeSemAcentos = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Divide o nome em partes
    const partesNome = nomeSemAcentos.split(" ").filter(parte => parte); // Remove partes vazias

    // Pega o primeiro e o último nome
    const primeiroNome = partesNome[0];
    const ultimoNome = partesNome[partesNome.length - 1];

    // Pega os dois últimos dígitos do RG
    const ultimosDigitosRg = rg.slice(-2);

    // Retorna o resultado formatado
    return `${primeiroNome.toLowerCase()}_${ultimoNome.toLowerCase()}${ultimosDigitosRg}`;
}



cadastroForm.addEventListener('submit', (e) => {
    let foto = carteirinha_pfp.files[carteirinha_pfp.files.length - 1]
    e.preventDefault()
    let login = formatarNomeERg(nome.value.trim(), rg.value.trim())
    const formData = new FormData(); // Cria um novo FormData

    formData.append('nome', nome.value.trim());
    formData.append('rg', rg.value);
    formData.append('data_nascimento', dataNascimento.value);
    formData.append('curso', curso.value.trim());
    formData.append('matricula', matricula.value);

    formData.append('foto_perfil', foto); // Adiciona o arquivo ao FormData
    formData.append('login', login);
    formData.append('horario_entrada', horario_entrada.value);
    formData.append('turma', turma.value)
    formData.append('senha', `senai117@${rg.value.substr(0, 2)}`);

    // Envia o FormData na requisição POST
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`); // Para depuração
    }

    registerUser(formData);
}) 