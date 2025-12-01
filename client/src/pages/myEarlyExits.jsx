import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Components
import UserHeader from "../components/layout/userHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import Footer from "../components/layout/footer.jsx";
import LoadingScreen from "../components/ui/loadingScreen.jsx";

// Icons
import { AlertCircle, CheckCircle, Clock, Plus, X, ArrowUpDown } from "lucide-react";

// Context & Services
import { useAuthContext } from "../context/authContext.jsx";
import useEarlyExits from "../hooks/useEarlyExits";

function MyEarlyExits() {
    const { user, loading: authLoading } = useAuthContext();
    const navigate = useNavigate();
    const {
        earlyExits,
        selectedEarlyExit,
        getMyEarlyExits,
        getMyEarlyExitById,
        createEarlyExit,
        loading: hookLoading,
    } = useEarlyExits();

    const [filter, setFilter] = useState("todos");
    const [sortOrder, setSortOrder] = useState("newest");
    const [showForm, setShowForm] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [formData, setFormData] = useState({
        motivo: "",
        horario_saida: "",
        observacao: "",
    });
    const [formLoading, setFormLoading] = useState(false);

    // Carrega liberações apenas quando authLoading muda e usuário é aluno
    useEffect(() => {
        const loadEarlyExits = async () => {
            if (!authLoading && user && user.cargo?.toLowerCase() === "aluno") {
                try {
                    const result = await getMyEarlyExits();
                    if (!result.success) {
                        toast.error(result.message || "Erro ao carregar liberações");
                    }
                } catch (error) {
                    toast.error("Erro ao carregar liberações");
                }
            }
        };

        loadEarlyExits();
    }, [authLoading, user]);

    // Redireciona se não for aluno
    if (!authLoading && user && user.cargo?.toLowerCase() !== "aluno") {
        navigate("/carteirinha-acesso");
        return null;
    }

    // Mostra loading enquanto verifica autenticação
    if (authLoading) return <LoadingScreen />;

    // Redireciona se não estiver logado
    if (!user) {
        navigate("/login");
        return null;
    }

    // Função para ordenar os registros
    const sortExits = (exits) => {
        return [...exits].sort((a, b) => {
            const dateA = new Date(a.timestamp || a.createdAt);
            const dateB = new Date(b.timestamp || b.createdAt);

            if (sortOrder === "newest") {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });
    };

    // Filtrar e ordenar dados
    const filteredExits = sortExits(
        filter === "todos"
            ? earlyExits
            : earlyExits.filter(
                (exit) => exit.status?.toLowerCase() === filter.toLowerCase()
            )
    );

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "permitida":
                return "bg-green-100 text-green-800 border-green-300";
            case "pendente":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "não permitida":
            case "nao permitida":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "permitida":
                return <CheckCircle size={18} />;
            case "pendente":
                return <AlertCircle size={18} />;
            case "não permitida":
            case "nao permitida":
                return <AlertCircle size={18} />;
            default:
                return <Clock size={18} />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return "-";
        const date = new Date(timeString);
        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        if (!formData.motivo.trim()) {
            toast.error("Por favor, informe o motivo da saída antecipada.");
            return;
        }

        if (!formData.horario_saida) {
            toast.error("Por favor, informe o horário de saída.");
            return;
        }

        setFormLoading(true);

        const payload = {
            motivo: formData.motivo,
            horario_saida: formData.horario_saida,
            observacao: formData.observacao || "",
        };

        const loadingToast = toast.loading("Enviando solicitação...");

        try {
            const res = await createEarlyExit(payload);

            if (res.success) {
                toast.success("Saída antecipada solicitada com sucesso!", {
                    id: loadingToast,
                });
                setFormData({ motivo: "", horario_saida: "", observacao: "" });
                setShowForm(false);
                // Recarrega a lista
                await getMyEarlyExits();
            } else {
                toast.error(res.message || "Erro ao solicitar saída antecipada.", {
                    id: loadingToast,
                });
            }
        } catch (error) {
            toast.error("Erro ao processar solicitação.", {
                id: loadingToast,
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleViewDetails = async (exit) => {

        try {
            const result = await getMyEarlyExitById(exit.id || exit._id);

            if (result.success) {
                setShowDetailModal(true);
            } else {
                toast.error(result.message || "Erro ao carregar detalhes.", {
                });
            }
        } catch (error) {
            toast.error("Erro ao carregar detalhes.", {
            });
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
        toast.success(`Ordenando por ${sortOrder === "newest" ? "mais antigos" : "mais recentes"}`);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        if (newFilter !== "todos") {
            const filterText = {
                "permitida": "permitidas",
                "pendente": "pendentes",
                "não permitida": "não permitidas"
            }[newFilter];
            toast.success(`Filtrando por ${filterText}`);
        } else {
            toast.success("Mostrando todos os registros");
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setFormData({ motivo: "", horario_saida: "", observacao: "" });
        toast.success("Formulário cancelado");
    };

    return (
        <>
            <UserHeader />
            <MainContent>
                <div className="w-full max-w-6xl mx-auto px-4 py-8">
                    {/* Title Section */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Minhas Liberações
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Solicite saídas antecipadas, acompanhe o status e veja detalhes de cada liberação
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => {
                                    setShowForm(!showForm);
                                    if (!showForm) {
                                        toast.success("Formulário de solicitação aberto");
                                    }
                                }}
                                className="flex items-center text-center w-full gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-md"
                            >
                                <Plus size={20} />
                                Solicitar Liberação
                            </button>
                        </div>
                    </div>

                    {/* Form Section - Solicitar Nova Liberação */}
                    {showForm && (
                        <div className="mb-8 bg-white border-2 border-red-500 rounded-lg p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Solicitar Saída Antecipada
                                </h2>
                                <button
                                    onClick={handleCloseForm}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitForm} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Motivo da Saída Antecipada *
                                    </label>
                                    <select
                                        value={formData.motivo}
                                        onChange={(e) =>
                                            handleInputChange("motivo", e.target.value)
                                        }
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none font-medium"
                                        required
                                    >
                                        <option value="">Selecione um motivo</option>
                                        <option value="Consulta médica">Consulta médica</option>
                                        <option value="Compromisso familiar">
                                            Compromisso familiar
                                        </option>
                                        <option value="Atividade extracurricular">
                                            Atividade extracurricular
                                        </option>
                                        <option value="Problemas de transporte">
                                            Problemas de transporte
                                        </option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Horário de Saída *
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.horario_saida}
                                        onChange={(e) =>
                                            handleInputChange("horario_saida", e.target.value)
                                        }
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none font-medium"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Observações (opcional)
                                    </label>
                                    <textarea
                                        value={formData.observacao}
                                        onChange={(e) =>
                                            handleInputChange("observacao", e.target.value)
                                        }
                                        placeholder="Adicione detalhes sobre sua saída antecipada..."
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none resize-none"
                                        rows="4"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {formLoading ? "Enviando..." : "Solicitar Liberação"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseForm}
                                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Filter and Sort Section */}
                    <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        {/* Filter Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleFilterChange("todos")}
                                className={`px-6 py-2 rounded-full font-semibold transition-all ${filter === "todos"
                                        ? "bg-red-500 text-white shadow-md"
                                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-500"
                                    }`}
                            >
                                Todos ({earlyExits.length})
                            </button>
                            <button
                                onClick={() => handleFilterChange("permitida")}
                                className={`px-6 py-2 rounded-full font-semibold transition-all ${filter === "permitida"
                                        ? "bg-green-500 text-white shadow-md"
                                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-500"
                                    }`}
                            >
                                Permitidas (
                                {
                                    earlyExits.filter(
                                        (e) => e.status?.toLowerCase() === "permitida"
                                    ).length
                                }
                                )
                            </button>
                            <button
                                onClick={() => handleFilterChange("pendente")}
                                className={`px-6 py-2 rounded-full font-semibold transition-all ${filter === "pendente"
                                        ? "bg-yellow-500 text-white shadow-md"
                                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-yellow-500"
                                    }`}
                            >
                                Pendentes (
                                {
                                    earlyExits.filter(
                                        (e) => e.status?.toLowerCase() === "pendente"
                                    ).length
                                }
                                )
                            </button>
                            <button
                                onClick={() => handleFilterChange("não permitida")}
                                className={`px-6 py-2 rounded-full font-semibold transition-all ${filter === "não permitida"
                                        ? "bg-red-600 text-white shadow-md"
                                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-600"
                                    }`}
                            >
                                Não Permitidas (
                                {
                                    earlyExits.filter(
                                        (e) => e.status?.toLowerCase() === "não permitida" ||
                                            e.status?.toLowerCase() === "nao permitida"
                                    ).length
                                }
                                )
                            </button>
                        </div>

                        {/* Sort Button */}
                        <button
                            onClick={toggleSortOrder}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${sortOrder === "newest"
                                    ? "bg-red-500 text-white shadow-md"
                                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-500"
                                }`}
                        >
                            <ArrowUpDown size={18} />
                            {sortOrder === "newest" ? "Mais Novos" : "Mais Antigos"}
                        </button>
                    </div>

                    {/* Count Section */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <p className="text-gray-700 font-semibold">
                                Mostrando{" "}
                                <span className="text-red-500">{filteredExits.length}</span> de{" "}
                                <span className="text-red-500">{earlyExits.length}</span>{" "}
                                registros
                            </p>
                            <p className="text-sm text-gray-600">
                                Ordenado por: <span className="font-semibold">{sortOrder === "newest" ? "Mais recentes primeiro" : "Mais antigos primeiro"}</span>
                            </p>
                        </div>
                    </div>

                    {/* Loading State */}
                    {hookLoading && !earlyExits.length ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
                            <Clock
                                size={48}
                                className="mx-auto text-gray-400 mb-4 animate-spin"
                            />
                            <p className="text-gray-600 font-semibold">
                                Carregando suas liberações...
                            </p>
                        </div>
                    ) : filteredExits.length > 0 ? (
                        <div className="space-y-4">
                            {filteredExits.map((exit) => (
                                <div
                                    key={exit._id || exit.id}
                                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        {/* Left Section */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold text-sm ${getStatusColor(
                                                        exit.status
                                                    )}`}
                                                >
                                                    <span>{exit.status}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                {exit.motivo || "Saída Antecipada"}
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600 font-medium mb-1">
                                                        Data da Solicitação
                                                    </p>
                                                    <p className="text-gray-800">
                                                        {formatDate(exit.timestamp || exit.createdAt)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-600 font-medium mb-1">
                                                        Horário de Saída
                                                    </p>
                                                    <p className="text-gray-800">
                                                        {formatTime(exit.horario_saida)}
                                                    </p>
                                                </div>

                                                {exit.responsavel && (
                                                    <div>
                                                        <p className="text-gray-600 font-medium mb-1">
                                                            Responsável
                                                        </p>
                                                        <p className="text-gray-800">{exit.responsavel}</p>
                                                    </div>
                                                )}

                                                {exit.observacao && (
                                                    <div className="md:col-span-2">
                                                        <p className="text-gray-600 font-medium mb-1">
                                                            Observações
                                                        </p>
                                                        <p className="text-gray-800">{exit.observacao}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Section */}
                                        <div className="md:w-32">
                                            <button
                                                onClick={() => handleViewDetails(exit)}
                                                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm"
                                            >
                                                Ver Detalhes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
                            <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Nenhum registro encontrado
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {filter === "todos"
                                    ? "Você ainda não tem liberações solicitadas. Solicite uma nova saída antecipada para começar."
                                    : `Você não tem liberações ${filter === "permitida"
                                        ? "permitidas"
                                        : filter === "pendente"
                                            ? "pendentes"
                                            : "não permitidas"
                                    } no momento.`}
                            </p>
                            {filter !== "todos" && (
                                <button
                                    onClick={() => handleFilterChange("todos")}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                                >
                                    Ver Todos
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Detail Modal */}
                {showDetailModal && selectedEarlyExit && (
                    <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-auto">
                            {/* Modal Header */}
                            <div className="bg-red-500 text-white p-6 rounded-t-lg">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">Comprovante de Liberação</h2>
                                    <button
                                        onClick={() => {
                                            setShowDetailModal(false);
                                        }}
                                        className="hover:bg-red-600 p-1 rounded transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-4">
                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 font-semibold">Status:</span>
                                    <div
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full border font-semibold text-sm ${getStatusColor(
                                            selectedEarlyExit.status
                                        )}`}
                                    >
                                        {getStatusIcon(selectedEarlyExit.earlyExit.status)}

                                        <span>{selectedEarlyExit.earlyExit.status}</span>
                                    </div>
                                </div>

                                {/* Informações do Aluno */}
                                <div className="border-t pt-4">
                                    <h3 className="text-gray-600 font-semibold mb-3">
                                        Informações do Aluno
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Nome:</span>
                                            <span className="text-gray-800 font-medium">
                                                {user?.nome || "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Matrícula:</span>
                                            <span className="text-gray-800 font-medium">
                                                {user?.matricula || "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Turma:</span>
                                            <span className="text-gray-800 font-medium">
                                                {user?.turma || "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Curso:</span>
                                            <span className="text-gray-800 font-medium text-right">
                                                {user?.curso || "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Informações da Liberação */}
                                <div className="border-t pt-4">
                                    <h3 className="text-gray-600 font-semibold mb-3">
                                        Informações da Liberação
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Motivo:</span>
                                            <span className="text-gray-800 font-medium text-right">
                                                {selectedEarlyExit.motivo || "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Horário de Saída:</span>
                                            <span className="text-gray-800 font-medium">
                                                {formatTime(selectedEarlyExit.horario_saida)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Data da Solicitação:
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                                {formatDate(selectedEarlyExit.timestamp || selectedEarlyExit.createdAt)}
                                            </span>
                                        </div>
                                        {selectedEarlyExit.updatedAt && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">
                                                    Última Atualização:
                                                </span>
                                                <span className="text-gray-800 font-medium">
                                                    {formatDate(selectedEarlyExit.updatedAt)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Observações */}
                                {selectedEarlyExit.observacao && (
                                    <div className="border-t pt-4">
                                        <h3 className="text-gray-600 font-semibold mb-2">
                                            Observações
                                        </h3>
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                            <p className="text-gray-800 text-sm">
                                                {selectedEarlyExit.observacao}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Responsável */}
                                {selectedEarlyExit.responsavel && (
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 text-sm">
                                                Responsável:
                                            </span>
                                            <span className="text-gray-800 font-medium text-sm">
                                                {selectedEarlyExit.responsavel}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="bg-gray-50 border-t border-gray-200 p-4 rounded-b-lg">
                                <button
                                    onClick={() => {
                                        setShowDetailModal(false);
                                        toast.success("Modal fechado");
                                    }}
                                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </MainContent>
            <Footer />
        </>
    );
}

export default MyEarlyExits;