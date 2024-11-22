const cadastroForm = document.getElementById('cadastroForm')
const nome = document.getElementById('nome');
const rg = document.getElementById('rg');
const dataNascimento = document.getElementById('data_nascimento');
const curso = document.getElementById('curso');
const matricula = document.getElementById('matricula');
const carteirinha_pfp = document.getElementById('foto-aluno');


async function registerUser(formData) {
    const token = localStorage.getItem('senai-id-token')
    console.log("register user")

    try {
        const resposta = await axios.post('http://localhost:3000/api/secretaria/registrar/aluno', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data' // Necessário para enviar arquivos
            }
        });
        console.log('Usuário registrado com sucesso:', resposta.data);
    } catch (error) {
        if (error.response && error.response.status === 403) {
            window.location.href = '../error/forbidden.html';
        } else {
            console.error('Erro ao registrar usuário:', error);
        }
    }
}


cadastroForm.addEventListener('submit', (e) => {
    let foto = carteirinha_pfp.files[carteirinha_pfp.files.length - 1]
    e.preventDefault()
    const formData = new FormData(); // Cria um novo FormData
    formData.append('cargo', 'aluno');
    formData.append('nome', nome.value.trim());
    formData.append('rg', rg.value);
    formData.append('data_nascimento', dataNascimento.value);
    formData.append('curso', curso.value.trim());
    formData.append('matricula', matricula.value);
    formData.append('foto_perfil', carteirinha_pfp.files[0]); // Adiciona o arquivo ao FormData
    formData.append('login', matricula.value);
    formData.append('senha', `senai117@${rg.value.substr(0, 2)}`);

    // Envia o FormData na requisição POST
    registerUser(formData);
}) 