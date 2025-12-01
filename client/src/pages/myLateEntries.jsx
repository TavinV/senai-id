import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Components
import UserHeader from "../components/layout/userHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import Footer from "../components/layout/footer.jsx";
import LoadingScreen from "../components/ui/loadingScreen.jsx";

// Icons
import { AlertCircle, CheckCircle, Clock, Plus, X, ArrowUpDown } from "lucide-react";

// Context & Services
import { useAuthContext } from "../context/authContext.jsx";
import useLateEntries from "../hooks/useLateEntries.jsx";

function MyLateEntries() {
  const { user, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  const {
    lateEntries,
    selectedLateEntry,
    getMyLateEntries,
    getMyLateEntryById,
    createLateEntry,
    loading: hookLoading,
  } = useLateEntries();

  const [filter, setFilter] = useState("todos");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"
  const [showForm, setShowForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [formData, setFormData] = useState({
    motivo: "",
    observacao: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  // Carrega atrasos ao montar
  useEffect(() => {
    if (!authLoading && user && user.cargo?.toLowerCase() === "aluno") {
      getMyLateEntries();
    }
  }, [authLoading, user, getMyLateEntries]);

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
  const sortEntries = (entries) => {
    return [...entries].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      
      if (sortOrder === "newest") {
        return dateB - dateA; // Mais novos primeiro
      } else {
        return dateA - dateB; // Mais antigos primeiro
      }
    });
  };

  // Filtrar e ordenar dados
  const filteredEntries = sortEntries(
    filter === "todos"
      ? lateEntries
      : lateEntries.filter(
          (entry) => entry.status?.toLowerCase() === filter.toLowerCase()
        )
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "validado":
        return "bg-green-100 text-green-800 border-green-300";
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "recusado":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "validado":
        return <CheckCircle size={18} />;
      case "pendente":
        return <AlertCircle size={18} />;
      case "recusado":
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!formData.motivo.trim()) {
      toast.error("Por favor, informe o motivo do atraso.");
      return;
    }

    setFormLoading(true);

    const payload = {
      motivo: formData.motivo,
      observacao: formData.observacao || "",
    };

    const res = await createLateEntry(payload);

    setFormLoading(false);

    if (res.success) {
      toast.success("Atraso registrado com sucesso!");
      setFormData({ motivo: "", observacao: "" });
      setShowForm(false);
      getMyLateEntries();
    } else {
      toast.error(res.message || "Erro ao registrar atraso.");
    }
  };

  const handleViewDetails = async (entry) => {
    await getMyLateEntryById(entry.id || entry._id);
    setShowDetailModal(true);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  return (
    <>
      <UserHeader />
      <MainContent>
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          {/* Title Section */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Meus Atrasos
            </h1>
            <p className="text-gray-600 text-lg">
              Acompanhe seus atrasos, solicite novos e veja detalhes de cada um
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center text-center w-full gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-md"
              >
                <Plus size={20} />
                Solicitar Atraso
              </button>
            </div>
          </div>

          {/* Form Section - Solicitar Novo Atraso */}
          {showForm && (
            <div className="mb-8 bg-white border-2 border-red-500 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Solicitar Novo Atraso
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Motivo do Atraso *
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
                    <option value="Trânsito">Trânsito</option>
                    <option value="Problema com transporte">
                      Problema com transporte
                    </option>
                    <option value="Compromisso familiar">
                      Compromisso familiar
                    </option>
                    <option value="Problema de saúde">Problema de saúde</option>
                    <option value="Outro">Outro</option>
                  </select>
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
                    placeholder="Adicione detalhes sobre seu atraso..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none resize-none"
                    rows="4"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50"
                  >
                    {formLoading ? "Enviando..." : "Registrar Atraso"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
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
                onClick={() => setFilter("todos")}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === "todos"
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-500"
                }`}
              >
                Todos ({lateEntries.length})
              </button>
              <button
                onClick={() => setFilter("validado")}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === "validado"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-500"
                }`}
              >
                Validados (
                {
                  lateEntries.filter(
                    (e) => e.status?.toLowerCase() === "validado"
                  ).length
                }
                )
              </button>
              <button
                onClick={() => setFilter("pendente")}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === "pendente"
                    ? "bg-yellow-500 text-white shadow-md"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-yellow-500"
                }`}
              >
                Pendentes (
                {
                  lateEntries.filter(
                    (e) => e.status?.toLowerCase() === "pendente"
                  ).length
                }
                )
              </button>
              <button
                onClick={() => setFilter("recusado")}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === "recusado"
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-600"
                }`}
              >
                Recusados (
                {
                  lateEntries.filter(
                    (e) => e.status?.toLowerCase() === "recusado"
                  ).length
                }
                )
              </button>
            </div>

            {/* Sort Button */}
            <button
              onClick={toggleSortOrder}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                sortOrder === "newest"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500"
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
                <span className="text-red-500">{filteredEntries.length}</span> de{" "}
                <span className="text-red-500">{lateEntries.length}</span>{" "}
                registros
              </p>
              <p className="text-sm text-gray-600">
                Ordenado por: <span className="font-semibold">{sortOrder === "newest" ? "Mais recentes primeiro" : "Mais antigos primeiro"}</span>
              </p>
            </div>
          </div>

          {/* Loading State */}
          {hookLoading && !lateEntries.length ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
              <Clock
                size={48}
                className="mx-auto text-gray-400 mb-4 animate-spin"
              />
              <p className="text-gray-600 font-semibold">
                Carregando seus atrasos...
              </p>
            </div>
          ) : filteredEntries.length > 0 ? (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <div
                  key={entry._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold text-sm ${getStatusColor(
                            entry.status
                          )}`}
                        >
                          {getStatusIcon(entry.status)}
                          <span>{entry.status || "Sem status"}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {entry.motivo || "Atraso"}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-medium mb-1">
                            Data da Solicitação
                          </p>
                          <p className="text-gray-800">
                            {formatDate(entry.createdAt)}
                          </p>
                        </div>

                        {entry.responsavel && (
                          <div>
                            <p className="text-gray-600 font-medium mb-1">
                              Responsável
                            </p>
                            <p className="text-gray-800">{entry.responsavel}</p>
                          </div>
                        )}

                        {entry.observacao && (
                          <div className="md:col-span-2">
                            <p className="text-gray-600 font-medium mb-1">
                              Observações
                            </p>
                            <p className="text-gray-800">{entry.observacao}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="md:w-32">
                      <button
                        onClick={() => handleViewDetails(entry)}
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
                  ? "Você ainda não tem atrasos registrados. Solicite um novo atraso para começar."
                  : `Você não tem atrasos ${
                      filter === "validado"
                        ? "validados"
                        : filter === "pendente"
                        ? "pendentes"
                        : "recusados"
                    } no momento.`}
              </p>
              {filter !== "todos" && (
                <button
                  onClick={() => setFilter("todos")}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                >
                  Ver Todos
                </button>
              )}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedLateEntry && (
          <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-auto">
              {/* Modal Header */}
              <div className="bg-red-500 text-white p-6 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Comprovante de Atraso</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
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
                      selectedLateEntry.status
                    )}`}
                  >
                    {getStatusIcon(selectedLateEntry.status)}
                    <span>{selectedLateEntry.status || "Sem status"}</span>
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

                {/* Informações do Atraso */}
                <div className="border-t pt-4">
                  <h3 className="text-gray-600 font-semibold mb-3">
                    Informações do Atraso
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Motivo:</span>
                      <span className="text-gray-800 font-medium text-right">
                        {selectedLateEntry.motivo || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Data da Solicitação:
                      </span>
                      <span className="text-gray-800 font-medium">
                        {formatDate(selectedLateEntry.createdAt)}
                      </span>
                    </div>
                    {selectedLateEntry.updatedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Última Atualização:
                        </span>
                        <span className="text-gray-800 font-medium">
                          {formatDate(selectedLateEntry.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Observações */}
                {selectedLateEntry.observacao && (
                  <div className="border-t pt-4">
                    <h3 className="text-gray-600 font-semibold mb-2">
                      Observações
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-gray-800 text-sm">
                        {selectedLateEntry.observacao}
                      </p>
                    </div>
                  </div>
                )}

                {/* Responsável */}
                {selectedLateEntry.responsavel && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">
                        Responsável:
                      </span>
                      <span className="text-gray-800 font-medium text-sm">
                        {selectedLateEntry.responsavel}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 border-t border-gray-200 p-4 rounded-b-lg">
                <button
                  onClick={() => setShowDetailModal(false)}
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

export default MyLateEntries;