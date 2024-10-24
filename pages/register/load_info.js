const fake_db_url = 'http://localhost:3000'
const profile_text = document.querySelector('.profile-text')
const params = new URLSearchParams(window.location.search)
const id = params.get('id')
let dados_secao = {}

fetch(`${fake_db_url}/administradores`)
        .then(resposta => resposta.json()).then(dados => {
         dados_secao = dados.filter((registro) => registro.id == id)[0]
         profile_text.innerHTML = `Olá, ${dados_secao.nome}`
        })