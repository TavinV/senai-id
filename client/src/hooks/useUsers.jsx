/* src/hooks/useUsers.jsx */
import { useState, useEffect } from "react";
import api from "../services/api";

// Função global geradora de senha
function generatePassword(cpf) {
  const lastTwo = cpf.replace(/\D/g, "").slice(-2);
  return `senai117@${lastTwo}`;
}

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function parseResponse(res) {
    return {
      success: res?.data?.success ?? false,
      message: res?.data?.message ?? "Operação realizada",
      data: res?.data?.data ?? null,
    };
  }

  /* =============================
   LIST ALL USERS
  ==============================*/
  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await api.get("/users");
      const parsed = parseResponse(res);
      setUsers(parsed.data || []);
      return parsed;
    } catch (err) {
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =============================
    GET USER BY ID
  ==============================*/
  async function getUserById(_id) {
    try {
      setLoading(true);
      const res = await api.get(`/users/${_id}`);
      const parsed = parseResponse(res);
      setSelectedUser(parsed.data);
      return parsed.data || null;
    } catch {
      setError("Usuário não encontrado");
      return null;
    } finally {
      setLoading(false);
    }
  }

  /* src/hooks/useUsers.jsx */
  async function createStudent(data) {
    try {
      setLoading(true);

      const form = new FormData();
      form.append("nome", data.nome);
      form.append("cpf", data.cpf);
      form.append("senha", generatePassword(data.cpf));
      form.append("turma", data.turma);
      form.append("matricula", data.matricula);
      form.append("data_nascimento", data.data_nascimento);
      form.append("curso", data.curso);
      form.append("foto_perfil", data.foto_perfil);

      // Let the browser/Axios set the Content-Type (including boundary)
      const res = await api.post("/users", form);

      const parsed = parseResponse(res);
      await fetchUsers();
      return parsed;

    } catch (err) {
      console.error("Erro ao criar aluno:", err);
      setError("Erro ao criar aluno");
      return null;
    } finally {
      setLoading(false);
    }
  }


  /* =============================
    CREATE EMPLOYEE /employees
  ==============================*/
  async function createEmployee(data) {
    try {
      setLoading(true);

      const form = new FormData();
      form.append("nome", data.nome);
      form.append("cpf", data.cpf);
      form.append("senha", generatePassword(data.cpf));
      form.append("descricao", data.descricao);
      form.append("nif", data.nif);
      form.append("pis", data.pis);
      form.append("email", data.email);
      form.append("foto_perfil", data.foto_perfil);

      // Let the browser/Axios set the Content-Type (including boundary)
      const res = await api.post("/users/employees", form);
      const parsed = parseResponse(res);

      await fetchUsers();
      return parsed;
    } catch (err) {
      console.error("Erro ao criar funcionário:", err);
      setError("Erro ao criar funcionário");
      return null;
    } finally {
      setLoading(false);
    }
  }

  /* =============================
    UPDATE USER
  ==============================*/
  async function updateUser(id, data) {
    try {
      setLoading(true);
      // Build payload with only non-empty fields to satisfy server validation
      const allowedPayload = {};
      Object.keys(data || {}).forEach((k) => {
        const v = data[k];
        if (v !== undefined && v !== null) {
          // include strings that are not empty
          if (typeof v === "string") {
            if (v.trim() !== "") allowedPayload[k] = v;
          } else {
            // include Files and other non-string values
            allowedPayload[k] = v;
          }
        }
      });

      let res;
      // If foto_perfil is a File, send FormData so multer handles it
      if (allowedPayload.foto_perfil && (allowedPayload.foto_perfil instanceof File || allowedPayload.foto_perfil?.name)) {
        const form = new FormData();
        Object.keys(allowedPayload).forEach((k) => {
          form.append(k, allowedPayload[k]);
        });
        // Let Axios/browser set Content-Type with proper boundary
        res = await api.put(`/users/${id}`, form);
      } else {
        // Send JSON with only allowed keys
        res = await api.put(`/users/${id}`, allowedPayload);
      }

      const parsed = parseResponse(res);
      if (!parsed.success) console.error("updateUser failed:", parsed.message);
      await fetchUsers();
      return parsed.success ?? false;
    } catch {
      setError("Erro ao atualizar usuário");
      return false;
    } finally {
      setLoading(false);
    }
  }

  /* =============================
    DELETE USER
  ==============================*/
  async function deleteUser(id) {
    try {
      setLoading(true);
      await api.delete(`/users/${id}`);
      if (selectedUser && selectedUser._id === id) setSelectedUser(null);
      await fetchUsers();
      return true;
    } catch {
      setError("Erro ao excluir usuário");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    users,
    selectedUser,
    loading,
    error,

    fetchUsers,
    getUserById,
    createStudent,
    createEmployee,
    updateUser,
    deleteUser,
    setSelectedUser,
  };
}
