/* src/hooks/useUsers.jsx */
import { useState, useEffect } from "react";
import api from "../services/api";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // LIST ALL USERS
  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // GET USER BY ID (and set selectedUser)
  async function getUserById(id) {
    try {
      setLoading(true);
      const res = await api.get(`/users/${id}`);
      const user = res.data?.data || null;
      setSelectedUser(user);
      return user;
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      setError("Usuário não encontrado");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // CREATE USER
  async function createUser(data) {
    try {
      setLoading(true);
      const res = await api.post("/users", data);
      await fetchUsers();
      return res.data;
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      setError("Erro ao criar usuário");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // UPDATE USER (PUT /users/:id)
  async function updateUser(id, data) {
    try {
      setLoading(true);
      const res = await api.put(`/users/${id}`, data);
      await fetchUsers();
      return res.data;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      setError("Erro ao atualizar usuário");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // DELETE USER
  async function deleteUser(id) {
    try {
      setLoading(true);
      await api.delete(`/users/${id}`);
      await fetchUsers();
      // if deleted user was selectedUser, clear it
      if (selectedUser && selectedUser._id === id) setSelectedUser(null);
      return true;
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      setError("Erro ao excluir usuário");
      return false;
    } finally {
      setLoading(false);
    }
  }

  // UPLOAD IMAGE helper (tries POST /upload and returns URL)
  // If your backend doesn't have /upload, adapte ou remova.
  async function uploadImage(file) {
    if (!file) return null;
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // expect: { url: 'https://...' } or similar. adapt if necessary.
      return res.data?.url ?? res.data?.data?.url ?? null;
    } catch (err) {
      console.warn("Upload falhou, verifique endpoint /upload:", err);
      return null;
    }
  }

  return {
    users,
    selectedUser,
    loading,
    error,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    uploadImage,
    setSelectedUser, // exposto caso queira limpar/forçar seleção
  };
}
