import { useEffect, useState } from "react";
import useLateEntries from "../hooks/useLateEntries";
import api from "../services/api";

export default function TestLateEntriesStudent() {
  const {
    lateEntries,
    selectedLateEntry,
    getMyLateEntries,
    getMyLateEntryById,
    createLateEntry,
    loading,
  } = useLateEntries();

  const [reason, setReason] = useState("");
  const [obs, setObs] = useState("");
  const [codigoBusca, setCodigoBusca] = useState("");
  const [feedback, setFeedback] = useState(null);

  function clearFeedback() {
    setTimeout(() => setFeedback(null), 4000);
  }

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    getMyLateEntries();
  }, []);

  async function handleRegister() {
    if (!reason.trim()) {
      setFeedback({ success: false, message: "Digite o motivo!" });
      return clearFeedback();
    }

    const body = { motivo: reason };
    if (obs.trim()) body.observacao = obs;

    const res = await createLateEntry(body);
    setFeedback(res);
    clearFeedback();

    if (res.success) {
      setReason("");
      setObs("");
      getMyLateEntries();
    }
  }

  async function handleSearch() {
    if (!codigoBusca.trim()) {
      setFeedback({ success: false, message: "Digite o código!" });
      return clearFeedback();
    }
    const res = await getMyLateEntryById(codigoBusca);
    setFeedback(res);
    clearFeedback();
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">👨‍🎓 Atrasos — Aluno</h1>

      {feedback && (
        <div className={`p-3 rounded text-white ${feedback.success ? "bg-green-600" : "bg-red-600"
          }`}>
          {feedback.message}
        </div>
      )}

      {/* Registrar atraso */}
      <div className="bg-white rounded shadow p-4 space-y-3">
        <h2 className="font-semibold">Registrar atraso</h2>

        <textarea
          className="w-full border rounded p-2"
          placeholder="Motivo do atraso"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <textarea
          className="w-full border rounded p-2"
          placeholder="Observação (opcional)"
          value={obs}
          onChange={(e) => setObs(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
          onClick={handleRegister}
        >
          {loading ? "Enviando..." : "Registrar atraso"}
        </button>
      </div>

      {/* Buscar atraso por código */}
      <div className="bg-white rounded shadow p-4 space-y-3">
        <h2 className="font-semibold">Buscar atraso por código</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={codigoBusca}
            className="border rounded p-2 flex-1"
            placeholder="Ex: gUgay83d"
            onChange={(e) => setCodigoBusca(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-purple-600 text-white px-4 rounded hover:bg-purple-700"
          >
            Buscar
          </button>
        </div>

        {selectedLateEntry && (
          <div className="p-3 border rounded bg-gray-50 mt-3">
            <p><b>Código:</b> {selectedLateEntry.id ?? selectedLateEntry._id}</p>
            <p><b>Motivo:</b> {selectedLateEntry.motivo}</p>
            <p><b>Observação:</b> {selectedLateEntry.observacao || "-"}</p>
            <p><b>Status:</b> {selectedLateEntry.status}</p>
            <p><b>Responsável:</b> {selectedLateEntry.responsavel ?? "-"}</p>
          </div>
        )}
      </div>

      {/* Lista de atrasos */}
      <div className="bg-white rounded shadow p-4 space-y-3">
        <h2 className="font-semibold flex justify-between items-center">
          Meus atrasos
          <button
            onClick={() => getMyLateEntries()}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Atualizar
          </button>
        </h2>

        {lateEntries && lateEntries.length > 0 ? (
          lateEntries.map((item) => (
            <div key={item.id} className="border rounded p-3 bg-gray-50">
              <p className="font-semibold">{item.motivo || "-"}</p>
              <p className="text-sm text-gray-600">Código: {item.id}</p>
              <p className="text-sm text-gray-600">
                Data: {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
              </p>
              <p className="text-sm text-gray-700">
                Obs: {item.observacao || "-"}
              </p>
              <p className={`text-sm mt-1 ${item.status === "Validado" ? "text-green-600" :
                  item.status === "Pendente" ? "text-yellow-600" :
                    "text-gray-600"
                }`}>
                {item.status}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Nenhum atraso encontrado</p>
        )}
      </div>
    </div>
  );
}
