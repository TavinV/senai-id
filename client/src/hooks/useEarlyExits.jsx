/* src/hooks/useEarlyExits.jsx */
import { useState, useCallback } from "react";
import api from "../services/api";

export default function useEarlyExits() {
  const [earlyExits, setEarlyExits] = useState([]);
  const [selectedEarlyExit, setSelectedEarlyExit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function parseResponse(res) {
    const success = res?.data?.success ?? true; // Assume sucesso se não especificado
    const message = res?.data?.message || "Operação realizada com sucesso";
    const data = res?.data?.data ?? null;

    return {
      success,
      message,
      data
    };
  }

  function handleApiError(err) {
    // Limpa estados de sucesso
    setSuccess(false);
    setSuccessMessage("");

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
    const genericMessage = err.message || "Erro ao processar solicitação";
    console.error("Erro na API:", err);
    setError(genericMessage);
    return {
      success: false,
      message: genericMessage,
      data: null
    };
  }

  function handleSuccess(message, data = null) {
    setError(null);
    setSuccess(true);
    setSuccessMessage(message);

    // Auto-limpeza da mensagem de sucesso após 5 segundos
    setTimeout(() => {
      setSuccess(false);
      setSuccessMessage("");
    }, 5000);

    return {
      success: true,
      message,
      data
    };
  }

  /* =============================
   * ALUNO
   ============================= */

  // GET /early-exits/me
  const getMyEarlyExits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await api.get("/early-exits/me");
      const parsed = parseResponse(res);

      setEarlyExits(parsed.data?.earlyExits || []);

      if (parsed.success && parsed.message) {
        setSuccess(true);
        setSuccessMessage(parsed.message);
      }

      return parsed;
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET /early-exits/me/:id
  const getMyEarlyExitById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await api.get(`/early-exits/me/${id}`);
      const parsed = parseResponse(res);

      setSelectedEarlyExit(parsed.data);

      if (parsed.success && parsed.message) {
        setSuccess(true);
        setSuccessMessage(parsed.message);
      }

      return parsed;
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // POST /early-exits/me/request
  const createEarlyExit = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await api.post("/early-exits/me/request", data);
      const parsed = parseResponse(res);

      // Se a criação foi bem-sucedida, atualiza a lista
      if (parsed.success) {
        // Recarrega a lista para incluir o novo item
        const refreshRes = await api.get("/early-exits/me");
        const refreshParsed = parseResponse(refreshRes);
        setEarlyExits(refreshParsed.data?.earlyExits || []);

        return handleSuccess(
          parsed.message || "Saída antecipada solicitada com sucesso!",
          parsed.data
        );
      } else {
        // Se a API retornou sucesso: false
        setError(parsed.message || "Erro ao solicitar saída antecipada");
        return {
          success: false,
          message: parsed.message || "Erro ao solicitar saída antecipada",
          data: null
        };
      }
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =============================
   * ADMIN
   ============================= */

  // GET /early-exits
  const getEarlyExits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await api.get("/early-exits");
      const parsed = parseResponse(res);

      setEarlyExits(parsed.data?.earlyExits || []);

      if (parsed.success && parsed.message) {
        setSuccess(true);
        setSuccessMessage(parsed.message);
      }

      return parsed;
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET /early-exits/:id
  const getEarlyExitById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await api.get(`/early-exits/${id}`);
      const parsed = parseResponse(res);

      setSelectedEarlyExit(parsed.data);

      if (parsed.success && parsed.message) {
        setSuccess(true);
        setSuccessMessage(parsed.message);
      }

      return parsed;
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // PUT /early-exits/:id/allow
  const allowEarlyExit = useCallback(async (id, data = {}) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await api.put(`/early-exits/${id}/allow`, data);
      const parsed = parseResponse(res);

      if (parsed.success) {
        // Atualiza a lista para refletir a mudança de status
        const refreshRes = await api.get("/early-exits");
        const refreshParsed = parseResponse(refreshRes);
        setEarlyExits(refreshParsed.data?.earlyExits || []);

        // Atualiza o item selecionado se for o mesmo
        setSelectedEarlyExit(prev =>
          prev && (prev.id === id || prev._id === id)
            ? { ...prev, status: "Permitida", ...data }
            : prev
        );

        return handleSuccess(
          parsed.message || "Saída antecipada permitida com sucesso!",
          parsed.data
        );
      } else {
        setError(parsed.message || "Erro ao permitir saída antecipada");
        return {
          success: false,
          message: parsed.message || "Erro ao permitir saída antecipada",
          data: null
        };
      }
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // PUT /early-exits/:id/deny
  const denyEarlyExit = useCallback(async (id, data = {}) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await api.put(`/early-exits/${id}/deny`, data);
      const parsed = parseResponse(res);

      if (parsed.success) {
        // Atualiza a lista para refletir a mudança de status
        const refreshRes = await api.get("/early-exits");
        const refreshParsed = parseResponse(refreshRes);
        setEarlyExits(refreshParsed.data?.earlyExits || []);

        // Atualiza o item selecionado se for o mesmo
        setSelectedEarlyExit(prev =>
          prev && (prev.id === id || prev._id === id)
            ? { ...prev, status: "Não permitida", ...data }
            : prev
        );

        return handleSuccess(
          parsed.message || "Saída antecipada recusada com sucesso!",
          parsed.data
        );
      } else {
        setError(parsed.message || "Erro ao recusar saída antecipada");
        return {
          success: false,
          message: parsed.message || "Erro ao recusar saída antecipada",
          data: null
        };
      }
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE /early-exits/:id
  const deleteEarlyExit = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await api.delete(`/early-exits/${id}`);
      const parsed = parseResponse(res);

      if (parsed.success) {
        // Remove o item da lista local
        setEarlyExits(prev => prev.filter(exit =>
          exit.id !== id && exit._id !== id
        ));

        // Limpa o item selecionado se for o mesmo
        setSelectedEarlyExit(prev =>
          prev && (prev.id === id || prev._id === id) ? null : prev
        );

        return handleSuccess(
          parsed.message || "Saída antecipada excluída com sucesso!",
          parsed.data
        );
      } else {
        setError(parsed.message || "Erro ao excluir saída antecipada");
        return {
          success: false,
          message: parsed.message || "Erro ao excluir saída antecipada",
          data: null
        };
      }
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para limpar todos os estados
  const clearStates = useCallback(() => {
    setError(null);
    setSuccess(false);
    setSuccessMessage("");
  }, []);

  return {
    // States
    earlyExits,
    selectedEarlyExit,
    loading,
    error,
    success,
    successMessage,

    // Ações do Aluno
    getMyEarlyExits,
    getMyEarlyExitById,
    createEarlyExit,

    // Ações do Admin
    getEarlyExits,
    getEarlyExitById,
    allowEarlyExit,
    denyEarlyExit,
    deleteEarlyExit,

    // Setters
    setSelectedEarlyExit,

    // Limpeza
    clearError: () => setError(null),
    clearSuccess: () => {
      setSuccess(false);
      setSuccessMessage("");
    },
    clearStates
  };
}