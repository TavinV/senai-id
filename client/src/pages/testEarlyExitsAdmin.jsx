import { useEffect, useState } from "react";
import useEarlyExits from "../hooks/useEarlyExits";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";

export default function TestEarlyExitsAdmin() {
    const {
        earlyExits,
        loading,
        error,
        getEarlyExits,
        allowEarlyExit,
        denyEarlyExit,
        deleteEarlyExit,
    } = useEarlyExits();

    const [responsavel, setResponsavel] = useState("");
    const [observacao, setObservacao] = useState("");

    const carregarAtrasos = async () => {
        const token = localStorage.getItem("jwtToken");
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await getEarlyExits();
        if (!res.success) toast.error(res.message);
    };

    useEffect(() => {
        carregarAtrasos();
    }, []);

    // Função para formatar o horário no formato hh:mm
    const formatarHorario = (dataString) => {
        if (!dataString) return "Não informado";

        try {
            const data = new Date(dataString);
            return data.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Sao_Paulo'
            });
        } catch (error) {
            console.error("Erro ao formatar horário:", error);
            return "Horário inválido";
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
            <Toaster position="bottom-right" />

            <h1 className="text-3xl font-bold text-blue-400 mb-6">
                Teste - Saídas Antecipadas (Secretaria)
            </h1>

            <hr className="border-gray-700 my-6" />

            {error && <p className="text-red-500 font-semibold mb-3">{error}</p>}

            {earlyExits.length === 0 ? (
                <p className="text-gray-400">Nenhuma saída encontrada</p>
            ) : (
                earlyExits.map((exit) => (
                    <div
                        key={exit.id}
                        className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700 mb-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p><b>ID:</b> {exit.id}</p>
                                <p><b>Status:</b>
                                    <span className={
                                        exit.status === "Permitida" ? "text-green-400 ml-2" :
                                            exit.status === "Não permitida" ? "text-red-400 ml-2" :
                                                "text-yellow-400 ml-2"
                                    }>
                                        {exit.status}
                                    </span>
                                </p>
                                <p><b>Motivo:</b> {exit.motivo}</p>
                                <p><b>Horário de Saída:</b> {formatarHorario(exit.horario_saida)}</p>
                            </div>
                            <div>
                                <p><b>Responsável:</b> {exit.responsavel || "Não definido"}</p>
                                <p><b>Observação:</b> {exit.observacao || "Nenhuma observação"}</p>
                                <p><b>Data de criação:</b> {new Date(exit.createdAt || exit.timestamp).toLocaleString('pt-BR')}</p>
                                <p><b>User ID:</b> {exit.user_id}</p>
                            </div>
                        </div>

                        {/* Inputs para ações */}
                        <div className="mt-4 space-y-3">
                            <input
                                type="text"
                                placeholder="Responsável"
                                className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                value={responsavel}
                                onChange={(e) => setResponsavel(e.target.value)}
                            />

                            <textarea
                                placeholder="Observação (opcional)"
                                className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                                rows="3"
                            />
                        </div>

                        {/* Ações */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            <button
                                onClick={async () => {
                                    if (!responsavel.trim())
                                        return toast.error("Responsável é obrigatório!");

                                    const res = await allowEarlyExit(exit.id, {
                                        responsavel,
                                        observacao,
                                    });

                                    if (res.success) {
                                        toast.success(res.message || "Saída autorizada!");
                                        setResponsavel("");
                                        setObservacao("");
                                        carregarAtrasos();
                                    } else toast.error(res.message);
                                }}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Enviando..." : "Liberar"}
                            </button>

                            <button
                                onClick={async () => {
                                    if (!responsavel.trim())
                                        return toast.error("Responsável é obrigatório!");

                                    const res = await denyEarlyExit(exit.id, {
                                        responsavel,
                                        observacao,
                                    });

                                    if (res.success) {
                                        toast.success(res.message || "Saída negada!");
                                        setResponsavel("");
                                        setObservacao("");
                                        carregarAtrasos();
                                    } else toast.error(res.message);
                                }}
                                disabled={loading}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Enviando..." : "Negar"}
                            </button>

                            <button
                                onClick={async () => {
                                    const res = await deleteEarlyExit(exit.id);

                                    if (res.success) {
                                        toast.success("Saída excluída!");
                                        carregarAtrasos();
                                    } else toast.error(res.message);
                                }}
                                disabled={loading}
                                className="bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Excluindo..." : "Excluir"}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}