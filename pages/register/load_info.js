const profile_text = document.querySelector('.profile-text')
const profile_pic = document.querySelector('.profile-img')

function encerrarSessao() {
    localStorage.removeItem('senai-id-token')
    window.location.href = '../../index.html'
}

async function carregarPainelAdm() {
    const token = localStorage.getItem('senai-id-token')
    if (!token) {
        window.location.href = '../../index.html'
    }

    axios.get(`http://localhost:3000/admsenaiid`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(function (resposta) {
            console.log(resposta)
            const { id, nome } = resposta.data.user

            // Carregando as informações do usuário Secretaria
            profile_text.innerHTML = nome

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