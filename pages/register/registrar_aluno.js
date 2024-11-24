const cadastroForm = document.getElementById('cadastroForm')
const nome = document.getElementById('nome');
const rg = document.getElementById('rg');
const dataNascimento = document.getElementById('data_nascimento');
const curso = document.getElementById('curso');
const matricula = document.getElementById('matricula');
const carteirinha_pfp = document.getElementById('foto-aluno');

let popup = document.querySelector('.popup');

function fecharPopup() {
    popup.classList.toggle("active");
}

function showPopup(Type, msg) {
    popup.classList.add("active")

    switch (Type) {
        case "loading":
            document.querySelector(".popup .loading").classList.toggle("active")
            break;
        case "success":
            document.querySelector(".popup .success").classList.toggle("active")
            break;
        case "error":
            document.querySelector(".popup .error").classList.toggle("active")
            document.querySelector(".popup .error h3").innerText = msg
        default:
            break;
    }
}


async function registerUser(formData) {
    const token = localStorage.getItem('senai-id-token')
    console.log("register user")

    showPopup("loading")
    showPopup("loading")

    try {
        const resposta = await axios.post('http://localhost:3000/api/secretaria/registrar/aluno', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data' // Necessário para enviar arquivos
            }
        });

        fecharPopup()
        showPopup("success")
        cadastroForm.reset()


        console.log('Usuário registrado com sucesso:', resposta.data);
    } catch (error) {
        if (error.response && error.response.status === 403) {
            window.location.href = '../error/forbidden.html';
        } else {
            fecharPopup()
            showPopup("error", error)
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
    formData.append('cargo', 'aluno');
    formData.append('nome', nome.value.trim());
    formData.append('rg', rg.value);
    formData.append('data_nascimento', dataNascimento.value);
    formData.append('curso', curso.value.trim());
    formData.append('matricula', matricula.value);
    formData.append('foto_perfil', carteirinha_pfp.files[0]); // Adiciona o arquivo ao FormData
    formData.append('login', login);
    formData.append('senha', `senai117@${rg.value.substr(0, 2)}`);

    // Envia o FormData na requisição POST
    registerUser(formData);
}) 