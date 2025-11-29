/* src/hooks/useUsers.jsx */
import { useState, useEffect } from "react";
import api from "../services/api";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auxiliar padrão de resposta da API
  function parseResponse(res) {
    return {
      success: res?.data?.success ?? false,
      message: res?.data?.message ?? "Operação realizada",
      data: res?.data?.data ?? null,
    };
  }

  // ==============================
  // PASSWORD GENERATION
  // ==============================
  function generatePassword(cpf) {
    const numeric = cpf.replace(/\D/g, "");
    const lastTwo = numeric.slice(-2);
    return `senai117@${lastTwo}`;
  }

  // ==============================
  // LIST ALL USERS
  // ==============================
  async function fetchUsers() {
    try {
      setLoading(true);

      const res = await api.get("/users");
      const parsed = parseResponse(res);

      setUsers(parsed.data || []);
      return parsed;
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar usuários");
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==============================
  // GET USER BY ID
  // ==============================
  async function getUserById(id) {
    try {
      setLoading(true);
      const res = await api.get(`/users/${id}`);
      const parsed = parseResponse(res);

      setSelectedUser(parsed.data);
      return parsed;
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      setError("Usuário não encontrado");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // ==============================
  // CREATE STUDENT (POST /users)
  // ==============================
  async function createStudent(data) {
    try {
      setLoading(true);

      const form = new FormData();
      form.append("nome", data.nome);
      form.append("cpf", data.cpf);
      form.append("data_nascimento", data.data_nascimento);
      form.append("descricao", data.descricao);
      form.append("email", data.email);
      form.append("senha", generatePassword(data.cpf));
      form.append("foto_perfil", data.foto_perfil);

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

  // ==============================
  // CREATE EMPLOYEE (POST /employees)
  // ==============================
  async function createEmployee(data) {
    try {
      setLoading(true);

      const form = new FormData();
      form.append("nome", data.nome);
      form.append("cpf", data.cpf);
      form.append("cargo", data.cargo);
      form.append("nif", data.nif);
      form.append("pis", data.pis);
      form.append("email", data.email);
      form.append("senha", generatePassword(data.cpf));
      form.append("foto_perfil", data.foto_perfil);

      const res = await api.post("/employees", form);
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

  // ==============================
  // UPDATE USER
  // ==============================
  async function updateUser(id, data) {
    try {
      setLoading(true);
      const res = await api.put(`/users/${id}`, data);
      const parsed = parseResponse(res);

      await fetchUsers();
      return parsed;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      setError("Erro ao atualizar usuário");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // ==============================
  // DELETE USER
  // ==============================
  async function deleteUser(id) {
    try {
      setLoading(true);
      await api.delete(`/users/${id}`);

      if (selectedUser && selectedUser._id === id) {
        setSelectedUser(null);
      }

      await fetchUsers();
      return true;
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
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
    updateUser,
    deleteUser,
    createStudent,
    createEmployee,
    setSelectedUser,
  };
}
