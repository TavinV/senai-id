/* src/hooks/useEarlyExits.jsx */
import { useState } from "react";
import api from "../services/api";

export default function useEarlyExits() {
  const [earlyExits, setEarlyExits] = useState([]);
  const [selectedEarlyExit, setSelectedEarlyExit] = useState(null);

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
   * ALUNO
   ============================= */

  // GET /early-exits/me
  async function getMyEarlyExits() {
    try {
      setLoading(true);
      const res = await api.get("/early-exits/me");
      const parsed = parseResponse(res);

      setEarlyExits(parsed.data?.earlyExits || []);
      return parsed;
    } catch (err) {
      console.error("Erro ao buscar saídas:", err);
      setError("Erro ao buscar saídas");
      return { success: false, message: "Erro ao buscar saídas", data: null };
    } finally {
      setLoading(false);
    }
  }

  // GET /early-exits/me/:id
  async function getMyEarlyExitById(id) {
    try {
      setLoading(true);
      const res = await api.get(`/early-exits/me/${id}`);
      const parsed = parseResponse(res);

      setSelectedEarlyExit(parsed.data);
      return parsed;
    } catch (err) {
      console.error("Erro ao buscar saída:", err);
      setError("Erro ao buscar saída");
      return { success: false, message: "Erro ao buscar saída", data: null };
    } finally {
      setLoading(false);
    }
  }

  // POST /early-exits/me/request
  async function createEarlyExit(data) {
    try {
      setLoading(true);
      const res = await api.post("/early-exits/me/request", data);
      return parseResponse(res);
    } catch (err) {
      console.error("Erro ao solicitar saída:", err);
      setError("Erro ao solicitar saída");
      return { success: false, message: "Erro ao solicitar saída", data: null };
    } finally {
      setLoading(false);
    }
  }

  /* =============================
   * ADMIN
   ============================= */

  // GET /early-exits
  async function getEarlyExits() {
    try {
      setLoading(true);
      const res = await api.get("/early-exits");
      const parsed = parseResponse(res);

      setEarlyExits(parsed.data?.earlyExits || []);
      return parsed;
    } catch (err) {
      console.error("Erro ao listar saídas:", err);
      setError("Erro ao listar saídas");
      return { success: false, message: "Erro ao listar saídas", data: null };
    } finally {
      setLoading(false);
    }
  }

  // GET /early-exits/:id
  async function getEarlyExitById(id) {
    try {
      setLoading(true);
      const res = await api.get(`/early-exits/${id}`);
      const parsed = parseResponse(res);

      setSelectedEarlyExit(parsed.data);
      return parsed;
    } catch (err) {
      console.error("Erro ao buscar saída:", err);
      setError("Erro ao buscar saída");
      return { success: false, message: "Erro ao buscar saída", data: null };
    } finally {
      setLoading(false);
    }
  }

  // PUT /early-exits/:id/allow
  async function allowEarlyExit(id, data) {
    try {
      setLoading(true);
      const res = await api.put(`/early-exits/${id}/allow`, data);
      return parseResponse(res);
    } catch (err) {
      console.error("Erro ao aprovar saída:", err);
      setError("Erro ao aprovar saída");
      return { success: false, message: "Erro ao aprovar saída", data: null };
    } finally {
      setLoading(false);
    }
  }

  // PUT /early-exits/:id/deny
  async function denyEarlyExit(id, data) {
    try {
      setLoading(true);
      const res = await api.put(`/early-exits/${id}/deny`, data);
      return parseResponse(res);
    } catch (err) {
      console.error("Erro ao negar saída:", err);
      setError("Erro ao negar saída");
      return { success: false, message: "Erro ao negar saída", data: null };
    } finally {
      setLoading(false);
    }
  }

  // DELETE /early-exits/:id
  async function deleteEarlyExit(id) {
    try {
      setLoading(true);
      const res = await api.delete(`/early-exits/${id}`);
      return parseResponse(res);
    } catch (err) {
      console.error("Erro ao excluir saída:", err);
      setError("Erro ao excluir saída");
      return { success: false, message: "Erro ao excluir saída", data: null };
    } finally {
      setLoading(false);
    }
  }

  return {
    earlyExits,
    selectedEarlyExit,
    loading,
    error,
    getMyEarlyExits,
    getMyEarlyExitById,
    createEarlyExit,
    getEarlyExits,
    getEarlyExitById,
    allowEarlyExit,
    denyEarlyExit,
    deleteEarlyExit,
    setSelectedEarlyExit,
  };
}
