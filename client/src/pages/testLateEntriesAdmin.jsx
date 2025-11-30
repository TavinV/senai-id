import { useEffect, useState } from "react";
import useLateEntries from "../hooks/useLateEntries";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";

export default function TestLateEntriesAdmin() {
    const {
        lateEntries,
        selectedLateEntry,
        loading,
        error,
        getLateEntries,
        getLateEntryById,
        validateLateEntry,
        deleteLateEntry,
    } = useLateEntries();

    const [codigo, setCodigo] = useState("");
    const [responsavel, setResponsavel] = useState("");
    const [observacao, setObservacao] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        getLateEntries();
    }, []);

    async function handleSearch() {
        if (!codigo.trim()) return toast.error("Informe o código!");
        const res = await getLateEntryById(codigo);
        if (!res.success) toast.error(res.message);
        else toast.success("Atraso encontrado!");
    }

    async function handleValidate(status) {
        if (!selectedLateEntry?.id) return toast.error("Nenhum atraso carregado!");

        if (!responsavel.trim()) {
            return toast.error("Responsável obrigatório!");
        }

        const res = await validateLateEntry(selectedLateEntry.id, {
            status,
            responsavel,
            observacao,
        });

        if (!res.success) toast.error(res.message);
        else {
            toast.success("Atraso atualizado!");
            await getLateEntries();
            setCodigo("");
            setResponsavel("");
            setObservacao("");
        }
    }

    async function handleDelete() {
        if (!selectedLateEntry?.id) return toast.error("Nenhum atraso carregado!");

        const res = await deleteLateEntry(selectedLateEntry.id);

        if (!res.success) toast.error(res.message);
        else {
            toast.success("Atraso removido!");
            await getLateEntries();
            setCodigo("");
        }
    }

    return (
        <div className="p-6 font-sans max-w-3xl mx-auto">
            <Toaster position="bottom-right" />
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Teste Secretaria - Atrasos</h1>

            {/* Buscar atraso */}
            <div className="p-4 border rounded-lg bg-gray-100 mb-6">
                <h2 className="text-xl font-semibold mb-2">Buscar atraso por código</h2>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Digite o código"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        className="border rounded-lg px-3 py-2 flex-1"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Buscar
                    </button>
                </div>

                {/* Exibindo atraso selecionado */}
                {selectedLateEntry && (
                    <div className="mt-4 p-3 border rounded bg-white shadow">
                        <p><strong>Código:</strong> {selectedLateEntry.id}</p>
                        <p><strong>Status:</strong> {selectedLateEntry.status}</p>
                        <p><strong>Motivo:</strong> {selectedLateEntry.motivo}</p>
                        <p><strong>Aluno:</strong> {selectedLateEntry.user_id}</p>
                        <p><strong>Obs. Admin:</strong> {selectedLateEntry.observacao || "-"}</p>

                        {/* Formulário para validar/recusar */}
                        <div className="mt-4 flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Responsável*"
                                className="border rounded px-3 py-2 w-full"
                                value={responsavel}
                                onChange={(e) => setResponsavel(e.target.value)}
                            />
                            <textarea
                                placeholder="Observação (opcional)"
                                className="border rounded px-3 py-2 w-full"
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                            />

                            <div className="flex gap-3">
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg"
                                    onClick={() => handleValidate("Validado")}
                                >
                                    Validar
                                </button>

                                <button
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg"
                                    onClick={() => handleValidate("Recusado")}
                                >
                                    Recusar
                                </button>

                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                                    onClick={handleDelete}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Lista geral */}
            <div className="mt-4">
                <h2 className="text-xl font-semibold">Todos os atrasos registrados</h2>

                {loading && <p className="text-gray-500 mt-4">Carregando...</p>}
                {error && <p className="text-red-600 mt-4">{error}</p>}

                <div className="flex flex-col gap-3 mt-4">
                    {lateEntries?.length > 0 ? (
                        lateEntries.map((l) => (
                            <div key={l._id} className="border p-3 rounded-lg bg-white shadow flex justify-between">
                                <div>
                                    <p><strong>Código:</strong> {l.id}</p>
                                    <p><strong>Status:</strong> {l.status}</p>
                                    <p><strong>Motivo:</strong> {l.motivo}</p>
                                </div>
                                <button
                                    onClick={() => setCodigo(l.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
                                >
                                    Abrir
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Nenhum atraso encontrado</p>
                    )}
                </div>
            </div>
        </div>
    );
}
