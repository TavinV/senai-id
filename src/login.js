const fake_db_url = 'http://localhost:3000'
const login_form = document.getElementById('login-form')

login_form.addEventListener('submit', (e) => {
    let login = document.getElementById('login').value.trim()
    let password = document.getElementById('password').value.trim()

    console.log(login);
    console.log(password);
    validar_login(login, password)
})

function validar_login(login, password) {
    // Verificando se é aluno
    fetch(`${fake_db_url}/alunos`)
        .then(resposta => resposta.json()).then(dados => {
            dados.forEach(registro => {
                if (registro.login === login && registro.senha === password){
                    window.location.replace(`../pages/access/carteirinha.html?id=${registro.id}`);
                    return
                }
            });
        })
        fetch(`${fake_db_url}/administradores`)
        .then(resposta => resposta.json()).then(dados => {
            dados.forEach(registro => {
                if (registro.login === login && registro.senha === password){
                    window.location.replace(`../pages/register/register.html?id=${registro.id}`);
                    return
                }
            });
        })
}