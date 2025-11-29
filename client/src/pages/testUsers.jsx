import { useEffect, useState } from "react";
import useUsers from "../hooks/useUsers.jsx";
import api from "../services/api.js";

export default function TestUsers() {
    const {
        users,
        loading,
        error,
        fetchUsers,
        createStudent,
        createEmployee,
        deleteUser
    } = useUsers();

    const [type, setType] = useState("student");
    const [form, setForm] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        fetchUsers();
    }, []);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleFile = (e) =>
        setForm({ ...form, foto_perfil: e.target.files[0] });

    const handleSubmit = async () => {
        if (!form.foto_perfil) return alert("Foto é obrigatória!");

        const action =
            type === "student" ? createStudent : createEmployee;

        const res = await action(form);
        console.log("Resposta:", res);
    };

    return (
        <div style={{ padding: 24 }}>
            <h1>Teste de Usuários</h1>

            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="student">Aluno</option>
                <option value="employee">Funcionário</option>
            </select>

            <br /><br />

            <input placeholder="Nome" name="nome" onChange={handleChange} />
            <input placeholder="CPF" name="cpf" onChange={handleChange} />
            <input placeholder="Email" name="email" onChange={handleChange} />

            {type === "student" && (
                <>
                    <input placeholder="Descrição" name="descricao" onChange={handleChange} />
                    <input type="date" name="data_nascimento" onChange={handleChange} />
                </>
            )}

            {type === "employee" && (
                <>
                    <input placeholder="Cargo" name="cargo" onChange={handleChange} />
                    <input placeholder="NIF" name="nif" onChange={handleChange} />
                    <input placeholder="PIS" name="pis" onChange={handleChange} />
                </>
            )}

            <input type="file" onChange={handleFile} />

            <button onClick={handleSubmit}>Criar</button>

            <hr />

            <h2>Usuários existentes</h2>

            {users.map((u) => (
                <div key={u._id} style={{ borderBottom: "1px solid #ddd", marginBottom: 8 }}>
                    <strong>{u.nome}</strong> — {u.cargo ?? "Aluno"}

                    <button
                        style={{ marginLeft: 12 }}
                        onClick={() => deleteUser(u.id)}
                    >
                        Excluir
                    </button>
                </div>
            ))}

            {loading && <p>Carregando...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
