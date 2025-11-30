import { useEffect, useState } from "react";
import useUsers from "../hooks/useUsers";
import api from "../services/api";

export default function TestUsers() {
    const {
        users,
        loading,
        error,
        fetchUsers,
        createStudent,
        createEmployee,
        deleteUser,
    } = useUsers();

    const [type, setType] = useState("student"); // student | employee
    const [form, setForm] = useState({});

    // Aplicar token ao axios ao carregar página
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        fetchUsers();
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleFile(e) {
        setForm({ ...form, foto_perfil: e.target.files[0] });
    }

    async function handleSubmit() {
        if (!form.foto_perfil) return alert("Foto de perfil obrigatória!");

        let response;
        if (type === "student") response = await createStudent(form);
        else response = await createEmployee(form);

        console.log("Resposta API:", response);
        alert(response?.message || "Operação realizada");
    }

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: 500 }}>
            <h1>Teste de Usuários</h1>

            {/* Seletor */}
            <label>
                Tipo de usuário:
                <select
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        setForm({});
                    }}
                    style={{ marginLeft: 10 }}
                >
                    <option value="student">Aluno</option>
                    <option value="employee">Funcionário</option>
                </select>
            </label>

            <hr />

            {/* Formulário */}
            <h3>{type === "student" ? "Cadastrar Aluno" : "Cadastrar Funcionário"}</h3>

            <input name="nome" placeholder="Nome" onChange={handleChange} />
            <br /><br />

            <input name="cpf" placeholder="CPF com máscara" onChange={handleChange} />
            <br /><br />

            {type === "student" && (
                <>
                    <input name="turma" placeholder="Turma" onChange={handleChange} />
                    <br /><br />

                    <input name="matricula" placeholder="Matrícula" onChange={handleChange} />
                    <br /><br />

                    <input
                        type="date"
                        name="data_nascimento"
                        onChange={handleChange}
                    />
                    <br /><br />

                    <input name="curso" placeholder="Curso" onChange={handleChange} />
                    <br /><br />
                </>
            )}

            {type === "employee" && (
                <>
                    <input name="descricao" placeholder="Descrição" onChange={handleChange} />
                    <br /><br />

                    <input name="nif" placeholder="NIF" onChange={handleChange} />
                    <br /><br />

                    <input name="pis" placeholder="PIS (11 dígitos)" onChange={handleChange} />
                    <br /><br />

                    <input name="email" placeholder="Email" onChange={handleChange} />
                    <br /><br />
                </>
            )}

            <label>
                Foto de Perfil:
                <input type="file" onChange={handleFile} />
            </label>

            <br /><br />
            <button onClick={handleSubmit}>Cadastrar</button>

            <hr />

            <h3>Usuários Registrados</h3>

            {loading && <p>Carregando...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {users?.length > 0 ? (
                users.map((u) => (
                    <div
                        key={u._id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            borderRadius: 4,
                            marginBottom: 8,
                        }}
                    >
                        <b>{u.nome}</b>
                        <br />
                        CPF: {u.cpf}
                        <br />
                        Tipo: {u.cargo ? "Funcionário" : "Aluno"}
                        <br />
                        <button
                            style={{ marginTop: 6 }}
                            onClick={() => {
                                deleteUser(u.id);
                                console.log("Excluído:", u.id);
                            }}
                        >
                            Excluir
                        </button>
                    </div>
                ))
            ) : (
                <p>Nenhum usuário encontrado</p>
            )}
        </div>
    );
}
