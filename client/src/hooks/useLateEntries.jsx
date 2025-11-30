/* src/hooks/useLateEntries.jsx */
import { useState } from "react";
import api from "../services/api";

export default function useLateEntries() {
  const [lateEntries, setLateEntries] = useState([]);
  const [selectedLateEntry, setSelectedLateEntry] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function parseResponse(errOrRes) {
    const res = errOrRes?.response || errOrRes;

    return {
      success: res?.data?.success ?? false,
      message: res?.data?.message ?? "Operação realizada",
      data: res?.data?.data ?? null,
    };
  }

  async function handleRequest(apiCall, onSuccess) {
    try {
      setLoading(true);
      const res = await apiCall();
      const parsed = parseResponse(res);
      if (onSuccess) onSuccess(parsed.data);
      setError(null);
      return parsed;
    } catch (err) {
      const parsed = parseResponse(err);
      setError(parsed.message);
      return parsed;
    } finally {
      setLoading(false);
    }
  }

  /* =============================
   * ALUNO
   ============================= */

  async function getMyLateEntries() {
    return handleRequest(
      () => api.get("/late-entries/me"),
      (data) => setLateEntries(data.atrasos || [])
    );
  }

  async function getMyLateEntryById(codigo) {
    return handleRequest(
      () => api.get(`/late-entries/me/${codigo}`),
      (data) => setSelectedLateEntry(data.lateEntry || null)
    );
  }

  async function createLateEntry(body) {
    return handleRequest(() => api.post("/late-entries/me/request", body));
  }

  /* =============================
   * ADMIN
   ============================= */

  async function getLateEntries() {
    return handleRequest(
      () => api.get("/late-entries"),
      (data) => setLateEntries(data.lateEntries || [])
    );
  }

  async function getLateEntryById(codigo) {
    return handleRequest(
      () => api.get(`/late-entries/${codigo}`),
      (data) => setSelectedLateEntry(data.lateEntry || null)
    );
  }

  async function validateLateEntry(codigo, data) {
    return handleRequest(() =>
      api.put(`/late-entries/${codigo}/validate`, data)
    );
  }

  async function deleteLateEntry(codigo) {
    return handleRequest(() =>
      api.delete(`/late-entries/${codigo}`)
    );
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
