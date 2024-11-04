const profile_text = document.querySelector('.profile-text')
const profile_pic = document.querySelector('.profile-img')

function encerrarSessao() {
        localStorage.removeItem('senai-id-token')
        window.location.href = '../../index.html'
    }

async function carregarFoto(token) {
        try {
            const resposta = await axios.get(`http://localhost:3000/carteirinha/userfotoperfil/`, {
                responseType: 'blob',  // Define que a resposta será um blob (arquivo binário),
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            const urlImagem = URL.createObjectURL(resposta.data);
    
            profile_pic.src = urlImagem;
    
        } catch (erro) {
            profile_pic.src = '../../img/404_image.jpg';
    
            console.error("Erro ao carregar a foto:", erro);
        }
}

async function carregarPainelAdm() {
        console.log("painel adm")
        const token = localStorage.getItem('senai-id-token')
        if (!token) {
            window.location.href = '../../index.html'
        }
    
        axios.get(`http://localhost:3000/admsenaiid`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(function (resposta) {
                console.log(resposta)
                const { id, nome} = resposta.data.user
                
                profile_text.innerHTML = nome

                // Buscando a foto de perfil
                carregarFoto(token)
    
            }).catch((erro) => {
                if (erro.status === 400) {
                    window.location.href = '../error/notfound.html'
                }
                if (erro.status === 403) {
                    window.location.href = '../error/forbidden.html'
                }
            })
    
}

carregarPainelAdm()