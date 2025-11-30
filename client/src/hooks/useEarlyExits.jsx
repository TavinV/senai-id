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

  function handleApiError(err) {
    // Verifica se é uma resposta da API com mensagem personalizada
    if (err.response?.data?.message) {
      const errorMessage = err.response.data.message;
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }

    // Erro de rede ou outros erros
    const genericMessage = "Erro ao processar solicitação";
    console.error("Erro na API:", err);
    setError(genericMessage);
    return {
      success: false,
      message: genericMessage,
      data: null
    };
  }

  /* =============================
   * ALUNO
   ============================= */

  // GET /early-exits/me
  async function getMyEarlyExits() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/early-exits/me");
      const parsed = parseResponse(res);

      setEarlyExits(parsed.data?.earlyExits || []);
      return parsed;
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }

  // GET /early-exits/me/:id
  async function getMyEarlyExitById(id) {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/early-exits/me/${id}`);
      const parsed = parseResponse(res);

      setSelectedEarlyExit(parsed.data);
      return parsed;
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }

  // POST /early-exits/me/request
  async function createEarlyExit(data) {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/early-exits/me/request", data);
      return parseResponse(res);
    } catch (err) {
      return handleApiError(err);
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
      setError(null);
      const res = await api.get("/early-exits");
      const parsed = parseResponse(res);

      setEarlyExits(parsed.data?.earlyExits || []);
      return parsed;
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }

  // GET /early-exits/:id
  async function getEarlyExitById(id) {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/early-exits/${id}`);
      const parsed = parseResponse(res);

      setSelectedEarlyExit(parsed.data);
      return parsed;
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }

  // PUT /early-exits/:id/allow
  async function allowEarlyExit(id, data) {
    try {
      setLoading(true);
      setError(null);
      const res = await api.put(`/early-exits/${id}/allow`, data);
      return parseResponse(res);
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }

  // PUT /early-exits/:id/deny
  async function denyEarlyExit(id, data) {
    try {
      setLoading(true);
      setError(null);
      const res = await api.put(`/early-exits/${id}/deny`, data);
      return parseResponse(res);
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }

  // DELETE /early-exits/:id
  async function deleteEarlyExit(id) {
    try {
      setLoading(true);
      setError(null);
      const res = await api.delete(`/early-exits/${id}`);
      return parseResponse(res);
    } catch (err) {
      return handleApiError(err);
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
    // Função para limpar erros manualmente
    clearError: () => setError(null),
  };
}