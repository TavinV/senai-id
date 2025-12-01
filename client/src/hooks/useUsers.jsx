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
      return null;
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
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      setError("Usuário não encontrado");
      return null;
    } finally {
      setLoading(false);
    }
  }

  /* =============================
    CREATE STUDENT
  ==============================*/
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
    CREATE EMPLOYEE
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
    UPDATE USER (GENÉRICO - PARA AMBOS OS TIPOS)
  ==============================*/
  async function updateUser(id, data, userType = null) {
    try {
      setLoading(true);

      // Se não temos userType, tentamos determinar pelo ID ou dados
      let actualUserType = userType;
      if (!actualUserType) {
        // Busca o usuário para determinar o tipo
        const user = await getUserById(id);
        actualUserType = user?.cargo === "aluno" ? "aluno" : "funcionario";
      }

      let formData = new FormData();
      const endpoint = `/users/${id}`;

      // Prepara os dados com base no tipo de usuário
      if (actualUserType === "aluno") {

        // Campos de aluno
        if (data.nome) formData.append("nome", data.nome);
        if (data.cpf) formData.append("cpf", data.cpf);
        if (data.matricula) formData.append("matricula", data.matricula);
        if (data.data_nascimento) formData.append("data_nascimento", data.data_nascimento);
        if (data.curso) formData.append("curso", data.curso);
        if (data.turma !== undefined) formData.append("turma", data.turma);
        if (data.foto_perfil) {
          if (data.foto_perfil instanceof File) {
            formData.append("foto_perfil", data.foto_perfil);
          } else if (typeof data.foto_perfil === 'string' && data.foto_perfil.startsWith('blob:')) {
            // Se é um blob URL (preview local), não enviamos
            console.log("Blob URL detectada - não enviando ao servidor");
          } else if (typeof data.foto_perfil === 'string') {
            // Se é uma URL existente do servidor, mantemos
          }
        }

      } else if (actualUserType === "funcionario") {

        // Campos de funcionário
        if (data.nome) formData.append("nome", data.nome);
        if (data.cpf) formData.append("cpf", data.cpf);
        if (data.pis) formData.append("pis", data.pis);
        if (data.nif) formData.append("nif", data.nif);
        if (data.email) formData.append("email", data.email);
        if (data.descricao) formData.append("descricao", data.descricao);
        if (data.foto_perfil) {
          if (data.foto_perfil instanceof File) {
            formData.append("foto_perfil", data.foto_perfil);
          } else if (typeof data.foto_perfil === 'string' && data.foto_perfil.startsWith('blob:')) {
            // Blob URL - não enviar
            console.log("Blob URL detectada - não enviando ao servidor");
          } else if (typeof data.foto_perfil === 'string') {
            // URL existente do servidor
            formData.append("foto_perfil_url", data.foto_perfil);
          }
        }
      } else {
        throw new Error("Tipo de usuário não identificado");
      }

      // Verifica se temos campos para enviar
      const hasEntries = [...formData.entries()].length > 0;

      let res;
      if (hasEntries) {
        // Envia como FormData (multipart/form-data)
        res = await api.put(endpoint, formData);
      } else {
        // Se não há dados, retorna erro
        console.error("Nenhum dado válido para atualizar");
        return false;
      }

      const parsed = parseResponse(res);

      if (parsed.success) {
        // Atualiza a lista de usuários
        await fetchUsers();
        // Atualiza o usuário selecionado
        if (selectedUser && selectedUser._id === id) {
          await getUserById(id);
        }
      } else {
        console.error("Erro na atualização:", parsed.message);
      }

      return parsed.success ?? false;

    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      setError(err.response?.data?.message || "Erro ao atualizar usuário");
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
      const res = await api.delete(`/users/${id}`);
      const parsed = parseResponse(res);

      if (selectedUser && selectedUser.id === id) {
        setSelectedUser(null);
      }

      // Atualiza a lista de usuários
      await fetchUsers();
      return !(parsed.success); // Retorna true se sucesso, false se falhou
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      setError(err.response?.data?.message || "Erro ao excluir usuário");
      return false; // Sempre retorna false em caso de erro
    } finally {
      setLoading(false);
    }
  }

  /* =============================
    GET USER TYPE
    Função auxiliar para determinar o tipo de usuário
  ==============================*/
  function getUserType(user) {
    if (!user) return null;
    return user.cargo === "aluno" ? "aluno" : "funcionario";
  }

  /* =============================
    FILTER USERS BY TYPE
  ==============================*/
  function filterUsersByType(type) {
    if (!type) return users;
    return users.filter(user => getUserType(user) === type);
  }

  return {
    users,
    selectedUser,
    loading,
    error,

    // Funções principais
    fetchUsers,
    getUserById,
    createStudent,
    createEmployee,
    updateUser,
    deleteUser,

    // Funções auxiliares
    getUserType,
    filterUsersByType,
    setSelectedUser,
  };
}