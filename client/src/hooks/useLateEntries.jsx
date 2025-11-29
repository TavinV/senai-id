/* src/hooks/useLateEntries.jsx */
import { useState } from "react";
import api from "../services/api";

export default function useLateEntries() {
  const [lateEntries, setLateEntries] = useState([]);
  const [selectedLateEntry, setSelectedLateEntry] = useState(null);

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

  // GET /late-entries/me
  async function getMyLateEntries() {
    try {
      setLoading(true);
      const res = await api.get("/late-entries/me");
      const parsed = parseResponse(res);
      setLateEntries(parsed.data || []);
      return parsed;
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar atrasos do aluno");
      return { success: false, message: "Erro ao buscar atrasos", data: null };
    } finally {
      setLoading(false);
    }
  }

  // GET /late-entries/me/:codigo
  async function getMyLateEntryById(codigo) {
    try {
      setLoading(true);
      const res = await api.get(`/late-entries/me/${codigo}`);
      const parsed = parseResponse(res);
      setSelectedLateEntry(parsed.data);
      return parsed;
    } catch (err) {
      console.error("Erro ao buscar atraso:", err);
      setError("Atraso não encontrado");
      return { success: false, message: "Atraso não encontrado", data: null };
    } finally {
      setLoading(false);
    }
  }

  // POST /late-entries/me/request
  async function createLateEntry(data) {
    try {
      setLoading(true);
      const res = await api.post("/late-entries/me/request", data);
      const parsed = parseResponse(res);
      return parsed;
    } catch (err) {
      console.error("Erro ao registrar atraso:", err);
      setError("Erro ao registrar atraso");
      return { success: false, message: "Erro ao registrar atraso", data: null };
    } finally {
      setLoading(false);
    }
  }

  /* =============================
   * ADMIN
   ============================= */

  // GET /late-entries
  async function getLateEntries() {
    try {
      setLoading(true);
      const res = await api.get("/late-entries");
      const parsed = parseResponse(res);
      setLateEntries(parsed.data.lateEntries || []);
      return parsed;
    } catch (err) {
      console.error(err);
      setError("Erro ao listar atrasos");
      return { success: false, message: "Erro ao listar atrasos", data: null };
    } finally {
      setLoading(false);
    }
  }

  // GET /late-entries/:codigo
  async function getLateEntryById(codigo) {
    try {
      setLoading(true);
      const res = await api.get(`/late-entries/${codigo}`);
      const parsed = parseResponse(res);
      setSelectedLateEntry(parsed.data);
      return parsed;
    } catch (err) {
      console.error("Erro ao buscar atraso:", err);
      setError("Atraso não encontrado");
      return { success: false, message: "Atraso não encontrado", data: null };
    } finally {
      setLoading(false);
    }
  }

  // PUT /late-entries/:codigo/validate
  async function validateLateEntry(codigo, data) {
    try {
      setLoading(true);
      const res = await api.put(`/late-entries/${codigo}/validate`, data);
      const parsed = parseResponse(res);
      return parsed;
    } catch (err) {
      console.error("Erro ao validar atraso:", err);
      setError("Erro ao validar atraso");
      return { success: false, message: "Erro ao validar atraso", data: null };
    } finally {
      setLoading(false);
    }
  }

  // DELETE /late-entries/:codigo
  async function deleteLateEntry(codigo) {
    try {
      setLoading(true);
      const res = await api.delete(`/late-entries/${codigo}`);
      const parsed = parseResponse(res);
      return parsed;
    } catch (err) {
      console.error("Erro ao excluir atraso:", err);
      setError("Erro ao excluir atraso");
      return { success: false, message: "Erro ao excluir atraso", data: null };
    } finally {
      setLoading(false);
    }
  }

  return {
    lateEntries,
    selectedLateEntry,
    loading,
    error,
    getMyLateEntries,
    getMyLateEntryById,
    createLateEntry,
    getLateEntries,
    getLateEntryById,
    validateLateEntry,
    deleteLateEntry,
    setSelectedLateEntry,
  };
}
