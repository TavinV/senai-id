import { useEffect, useState } from "react";
import api from "../services/api";
import useEarlyExits from "../hooks/useEarlyExits";

export default function TestEarlyExitsStudent() {
    const {
        earlyExits,
        selectedEarlyExit,
        loading,
        error,
        getMyEarlyExits,
        getMyEarlyExitById,
        createEarlyExit,
    } = useEarlyExits();

    const [motivo, setMotivo] = useState("");
    const [horario, setHorario] = useState("");
    const [observacao, setObservacao] = useState("");
    const [codigo, setCodigo] = useState("");
    const [apiMessage, setApiMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        getMyEarlyExits();
    }, []);

    async function handleCreate() {
        if (!motivo) return setApiMessage("Motivo é obrigatório!");
        if (!horario) return setApiMessage("Horário de saída é obrigatório!");

        const res = await createEarlyExit({
            motivo,
            horario_saida: horario,
            observacao: observacao || "",
        });

        setApiMessage(res.message);
        if (res.success) {
            setMotivo("");
            setHorario("");
            setObservacao("");
            getMyEarlyExits();
        }
    }

    async function handleSearchById() {
        if (!codigo) return setApiMessage("Digite um ID!");
        const res = await getMyEarlyExitById(codigo);
        setApiMessage(res.message);
    }

    return (
        <div className="max-w-2xl mx-auto p-5 font-sans">
            <h1 className="text-xl font-bold mb-4">🚪 Teste — Saída Antecipada (Aluno)</h1>

            {apiMessage && (
                <p className="mb-3 text-sm text-blue-700 font-semibold">{apiMessage}</p>
            )}
            {error && <p className="text-red-500">{error}</p>}

            {/* Criar Saída */}
            <div className="border p-4 rounded bg-gray-100 mb-6">
                <h2 className="font-semibold mb-3">Solicitar Saída</h2>

                <input
                    type="text"
                    className="border p-2 rounded w-full"
                    placeholder="Motivo *"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                />

                <input
                    type="time"
                    className="border p-2 rounded w-full mt-2"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                />

                <textarea
                    className="border p-2 rounded w-full mt-2"
                    placeholder="Observação (opcional)"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                />

                <button
                    onClick={handleCreate}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Enviar Solicitação
                </button>
            </div>

            {/* Buscar por ID */}
            <div className="border p-4 rounded bg-gray-100 mb-6">
                <h2 className="font-semibold mb-2">Buscar Saída por Código</h2>
                <input
                    type="text"
                    className="border p-2 rounded w-full"
                    placeholder="Ex: AbC123Xy"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                />

                <button
                    onClick={handleSearchById}
                    className="mt-2 bg-purple-600 text-white px-4 py-2 rounded"
                >
                    Buscar
                </button>

                {selectedEarlyExit && (
                    <div className="mt-4 p-3 bg-gray-200 rounded">
                        <p><b>ID:</b> {selectedEarlyExit?.earlyExit?.id}</p>
                        <p><b>Status:</b> {selectedEarlyExit?.earlyExit?.status}</p>
                        <p><b>Motivo:</b> {selectedEarlyExit?.earlyExit?.motivo}</p>
                        <p><b>Horário:</b> {selectedEarlyExit?.earlyExit?.horario_saida}</p>
                        <p><b>Observação:</b> {selectedEarlyExit?.earlyExit?.observacao}</p>
                    </div>
                )}
            </div>

            {/* Lista */}
            <h2 className="font-semibold mb-2">Minhas Saídas</h2>
            {loading ? (
                <p>Carregando...</p>
            ) : earlyExits.length === 0 ? (
                <p>Nenhuma saída encontrada.</p>
            ) : (
                earlyExits.map((exit) => (
                    <div
                        key={exit.id}
                        className="border p-3 rounded mb-2 bg-white shadow-sm"
                    >
                        <p><b>ID:</b> {exit.id}</p>
                        <p><b>Status:</b> {exit.status}</p>
                        <p><b>Motivo:</b> {exit.motivo}</p>
                        <p><b>Horário:</b> {exit.horario_saida}</p>
                    </div>
                ))
            )}
        </div>
    );
}
