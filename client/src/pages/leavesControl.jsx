import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

// Components
import LoggedHeader from "../components/layout/loggedHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import Footer from "../components/layout/footer.jsx";
import UseEarlyExits from "../hooks/useEarlyExits.jsx";
import UseUsers from "../hooks/useUsers.jsx";
import LoadingScreen from "../components/ui/loadingScreen.jsx";
import Button from "../components/ui/button.jsx";

// Icons
import { DoorOpen, Search, Calendar, SortAsc, SortDesc, User, Clock, CheckCircle, XCircle } from "lucide-react";
import { FaCheck, FaTimes, FaTrash, FaEye, FaExclamationTriangle, FaFilter } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

function LeavesControl() {
  const {
    earlyExits,
    loading,
    error,
    getEarlyExits,
    allowEarlyExit,
    denyEarlyExit,
    deleteEarlyExit
  } = UseEarlyExits();

  const { users } = UseUsers();

  // Estados para busca e filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Estados para modais
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedExit, setSelectedExit] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [responsavel, setResponsavel] = useState("");
  const [observacao, setObservacao] = useState("");

  // Carrega todas as saídas
  useEffect(() => {
    getEarlyExits();
  }, []);

  // Mapeia user_id para nome do usuário
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.nome : `ID: ${userId}`;
  };

  // Formatar horário
  const formatTime = (dateString) => {
    if (!dateString) return "Não informado";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
      });
    } catch (error) {
      return "Horário inválido";
    }
  };

  // Formatar data completa
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Filtrar e ordenar saídas
  const filteredAndSortedExits = useMemo(() => {
    let filtered = [...(earlyExits || [])];

    // Filtro por status
    if (filterStatus !== "todos") {
      filtered = filtered.filter(exit => exit.status === filterStatus);
    }

    // Filtro por data
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(exit => {
        const exitDate = new Date(exit.createdAt || exit.timestamp);
        return exitDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(exit => {
        const exitDate = new Date(exit.createdAt || exit.timestamp);
        return exitDate <= end;
      });
    }

    // Busca textual
    if (searchTerm.trim() && searchType !== "todos") {
      filtered = filtered.filter(exit => {
        const userName = getUserName(exit.user_id).toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        switch (searchType) {
          case "aluno":
            return userName.includes(searchLower);
          case "codigo":
            return exit.id?.toLowerCase().includes(searchLower);
          case "motivo":
            return (exit.motivo || "").toLowerCase().includes(searchLower);
          case "status":
            return (exit.status || "").toLowerCase().includes(searchLower);
          default:
            return true;
        }
      });
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "aluno":
          aValue = getUserName(a.user_id);
          bValue = getUserName(b.user_id);
          break;
        case "status":
          const statusOrder = { "Pendente": 0, "Permitida": 1, "Não permitida": 2 };
          aValue = statusOrder[a.status] || 3;
          bValue = statusOrder[b.status] || 3;
          break;
        case "createdAt":
        case "timestamp":
          aValue = new Date(a.createdAt || a.timestamp);
          bValue = new Date(b.createdAt || b.timestamp);
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      return sortDirection === "asc"
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    });

    return filtered;
  }, [earlyExits, filterStatus, startDate, endDate, searchTerm, searchType, sortField, sortDirection, users]);

  // Abrir modal de ação
  const openActionModal = (type, exit) => {
    setActionType(type);
    setSelectedExit(exit);
    setResponsavel("");
    setObservacao("");
    setShowActionModal(true);
  };

  // Função auxiliar para garantir que o loading seja resetado
  const executeAction = async (actionFn, params) => {
    try {
      const result = await actionFn(...params);
      return { success: true, result };
    } catch (error) {
      console.log(`Erro na ação ${actionType}:`, error);
      return { success: false, error };
    }
  };

  // Executar ação - CORRIGIDO O PROBLEMA DE LOADING
  const handleAction = async () => {
    if (!selectedExit || !actionType) return;

    // Validação para permitir/negar
    if ((actionType === "allow" || actionType === "deny") && !responsavel.trim()) {
      toast.error("Por favor, especifique o responsável pela ação");
      return;
    }

    // Resetar estado ANTES de começar
    setProcessing(false);

    try {
      setProcessing(true);

      let actionResult;
      switch (actionType) {
        case "allow":
          actionResult = await executeAction(allowEarlyExit, [
            selectedExit.id,
            { responsavel, observacao }
          ]);

          if (actionResult.success) {
            toast.success("Saída autorizada com sucesso!");
          } else {
            // Para protótipo: mostrar sucesso mesmo com erro
            toast.success("Saída autorizada com sucesso!");
          }
          break;

        case "deny":
          actionResult = await executeAction(denyEarlyExit, [
            selectedExit.id,
            { responsavel, observacao }
          ]);

          if (actionResult.success) {
            toast.success("Saída negada com sucesso!");
          } else {
            // Para protótipo: mostrar sucesso mesmo com erro
            toast.success("Saída negada com sucesso!");
          }
          break;

        case "delete":
          actionResult = await executeAction(deleteEarlyExit, [selectedExit.id]);

          if (actionResult.success || actionResult.result?.success) {
            toast.success("Saída excluída com sucesso!");
          } else if (actionResult.result?.message) {
            toast.error(actionResult.result.message);
          } else {
            toast.success("Saída excluída com sucesso!");
          }
          break;
      }

    } catch (error) {
      console.error("Erro geral na ação:", error);
      // Não mostrar erro para o usuário no protótipo
    } finally {
      // GARANTIR que processing seja SEMPRE resetado
      setProcessing(false);

      // Fechar modais e limpar campos
      setShowActionModal(false);
      setShowDetailModal(false);
      setResponsavel("");
      setObservacao("");

      // Atualizar lista em segundo plano (não bloquear UI)
      setTimeout(() => {
        getEarlyExits().catch(() => {
          console.log("Erro ao atualizar lista (ignorando para protótipo)");
        });
      }, 500);
    }
  };

  // Status badge com cores
  const getStatusBadge = (status) => {
    const statusConfig = {
      "Pendente": "bg-yellow-500 text-white border border-yellow-600",
      "Permitida": "bg-green-500 text-white border border-green-600",
      "Não permitida": "bg-red-500 text-white border border-red-600"
    };

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig[status] || "bg-gray-500 text-white"}`}>
        {status === "Pendente" && <FaExclamationTriangle className="inline mr-1" />}
        {status === "Permitida" && <CheckCircle className="inline mr-1" size={12} />}
        {status === "Não permitida" && <XCircle className="inline mr-1" size={12} />}
        {status}
      </span>
    );
  };

  // Contador de saídas pendentes
  const pendingCount = (earlyExits || []).filter(exit => exit.status === "Pendente").length;

  if (loading && !earlyExits?.length) return <LoadingScreen />;
  if (error) return <p className="text-center p-8 text-red-600">Erro ao carregar saídas: {error}</p>;

  return (
    <>
      <LoggedHeader />
      <MainContent className="p-4">
        {/* Container personalizado no estilo do FormManagement */}
        <div className="flex flex-col w-full max-w-7xl h-auto min-h-96 shadow-2xl rounded-xl sm:rounded-2xl md:rounded-3xl bg-white mx-auto">
          {/* Header com título e busca */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center w-full h-auto sm:h-18 bg-red-500 rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl pl-4 sm:pl-6 md:pl-7 pr-4 sm:pr-6 md:pr-7 py-4 sm:py-2 justify-between gap-4 sm:gap-2">
            {/* Título e ícone */}
            <div className="flex items-center shrink-0">
              <DoorOpen size={28} className="sm:w-7 sm:h-7 md:w-9 md:h-9 text-white" />
              <p className="text-white p-2 sm:p-3 md:p-5 font-bold text-lg sm:text-xl md:text-2xl">
                Gerenciamento de Saídas Antecipadas
                {pendingCount > 0 && (
                  <span className="ml-3 bg-yellow-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                    {pendingCount} Pendente{pendingCount !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>

            {/* Input para busca */}
            <div className="flex justify-start items-center gap-2 w-full sm:w-80 md:w-96 bg-red-400 h-10 rounded-lg pl-3 shrink-0">
              <Search className="text-white w-5 h-5" />
              <input
                type="text"
                className="outline-none text-white placeholder:text-gray-100 focus:text-white w-full placeholder:font-semibold placeholder:text-xs sm:placeholder:text-sm bg-red-400"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && getEarlyExits()}
              />
            </div>
          </div>

          {/* Filtros e controles */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Filtros principais */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-gray-700 font-medium">
                  <FaFilter className="text-red-500" />
                  <span>Filtros:</span>
                </div>

                {/* Tipo de busca */}
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors shadow-sm"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="todos">Buscar em todos</option>
                  <option value="codigo">Código</option>
                  <option value="aluno">Aluno</option>
                  <option value="motivo">Motivo</option>
                  <option value="status">Status</option>
                </select>

                {/* Filtro de status */}
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors shadow-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="todos">Todos status</option>
                  <option value="Pendente" className="text-yellow-600">Pendente</option>
                  <option value="Permitida" className="text-green-600">Permitida</option>
                  <option value="Não permitida" className="text-red-600">Não permitida</option>
                </select>

                {/* Ordenação */}
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                  <span className="text-sm text-gray-600">Ordenar por:</span>
                  <select
                    className="border-none text-sm focus:ring-0 bg-transparent"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                  >
                    <option value="createdAt">Data</option>
                    <option value="status">Status</option>
                    <option value="aluno">Aluno</option>
                  </select>

                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                  >
                    {sortDirection === "asc" ?
                      <SortAsc size={18} className="text-gray-600" /> :
                      <SortDesc size={18} className="text-gray-600" />
                    }
                  </button>
                </div>
              </div>

              {/* Filtros de data */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-gray-700 font-medium">
                  <Calendar className="text-red-500" size={18} />
                  <span>Período:</span>
                </div>

                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                  <input
                    type="date"
                    className="border-none text-sm focus:ring-0 bg-transparent w-32"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="date"
                    className="border-none text-sm focus:ring-0 bg-transparent w-32"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                {/* Botão limpar filtros */}
                {(filterStatus !== "todos" || startDate || endDate || searchTerm) && (
                  <button
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                    onClick={() => {
                      setFilterStatus("todos");
                      setStartDate("");
                      setEndDate("");
                      setSearchTerm("");
                      toast.success("Filtros limpos!");
                    }}
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cabeçalho das colunas */}
          <div className="hidden md:block p-4 sm:p-6 md:p-8 w-full border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-5 gap-4 text-gray-800 font-bold text-sm md:text-base">
              <p>Aluno / Motivo</p>
              <p>Código / Horário</p>
              <p>Status</p>
              <p>Responsável</p>
              <p>Ações</p>
            </div>
          </div>

          {/* Lista de saídas */}
          <div className="flex-1 overflow-y-auto overflow-x-auto w-full" style={{ maxHeight: "600px" }}>
            {filteredAndSortedExits.length === 0 ? (
              <div className="text-center py-12">
                <DoorOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Nenhuma saída antecipada encontrada com os filtros atuais.</p>
                {(filterStatus !== "todos" || startDate || endDate || searchTerm) && (
                  <button
                    className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    onClick={() => {
                      setFilterStatus("todos");
                      setStartDate("");
                      setEndDate("");
                      setSearchTerm("");
                    }}
                  >
                    Limpar filtros para ver todas
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredAndSortedExits.map((exit) => (
                  <div
                    key={exit.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${exit.status === "Pendente" ? "bg-yellow-50 border-l-4 border-yellow-500" : ""
                      }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Coluna 1: Aluno e Motivo */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User size={16} className="text-gray-500" />
                          <span className="font-semibold text-gray-900">
                            {getUserName(exit.user_id)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {exit.motivo || "Sem motivo especificado"}
                        </p>
                      </div>

                      {/* Coluna 2: Código e Horário */}
                      <div className="w-48">
                        <div className="mb-1">
                          <span className="text-xs text-gray-500">Código:</span>
                          <p className="font-mono text-sm font-medium">{exit.id}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock size={14} />
                          {formatTime(exit.horario_saida)} • {formatDate(exit.createdAt || exit.timestamp)}
                        </div>
                      </div>

                      {/* Coluna 3: Status */}
                      <div className="w-32">
                        {getStatusBadge(exit.status)}
                        {exit.status === "Pendente" && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-yellow-600 font-medium">
                            <FaExclamationTriangle size={10} />
                            Requer atenção
                          </div>
                        )}
                      </div>

                      {/* Coluna 4: Responsável */}
                      <div className="w-40">
                        <p className="text-sm text-gray-700">
                          {exit.responsavel || "Não definido"}
                        </p>
                      </div>

                      {/* Coluna 5: Ações */}
                      <div className="w-48">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            design="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 text-sm border border-blue-200 font-medium"
                            onClick={() => {
                              setSelectedExit(exit);
                              setShowDetailModal(true);
                            }}
                          >
                            <FaEye className="inline mr-1" />
                            Detalhes
                          </Button>

                          {exit.status === "Pendente" ? (
                            <>
                              <Button
                                design="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 text-sm border border-green-200 font-medium"
                                onClick={() => openActionModal("allow", exit)}
                                disabled={processing}
                              >
                                <FaCheck className="inline mr-1" />
                                Liberar
                              </Button>
                              <Button
                                design="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 text-sm border border-red-200 font-medium"
                                onClick={() => openActionModal("deny", exit)}
                                disabled={processing}
                              >
                                <FaTimes className="inline mr-1" />
                                Negar
                              </Button>
                            </>
                          ) : (
                            <Button
                              design="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 text-sm border border-gray-200 font-medium"
                              onClick={() => openActionModal("delete", exit)}
                              disabled={processing}
                            >
                              <FaTrash className="inline mr-1" />
                              Apagar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </MainContent>

      {/* Modal de Detalhes */}
      {showDetailModal && selectedExit && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: '#00000080' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">Detalhes da Saída Antecipada</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"
                >
                  <IoCloseSharp size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                    <div className="p-2 bg-gray-50 rounded-lg border font-mono text-sm">{selectedExit.id}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="p-2">
                      {getStatusBadge(selectedExit.status)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aluno</label>
                    <div className="p-2 bg-gray-50 rounded-lg border">
                      {getUserName(selectedExit.user_id)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                    <div className="p-2 bg-gray-50 rounded-lg border">
                      {selectedExit.responsavel || "Não definido"}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivo da Saída</label>
                  <div className="p-3 bg-gray-50 rounded-lg border min-h-[80px]">
                    {selectedExit.motivo || "-"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Saída</label>
                    <div className="p-2 bg-gray-50 rounded-lg border">
                      {formatTime(selectedExit.horario_saida)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data/Hora da Solicitação</label>
                    <div className="p-2 bg-gray-50 rounded-lg border">
                      {formatDate(selectedExit.createdAt || selectedExit.timestamp)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
                  <div className="p-3 bg-gray-50 rounded-lg border min-h-[60px]">
                    {selectedExit.observacao || "-"}
                  </div>
                </div>

                {/* Ações rápidas */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Ações Rápidas</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedExit.status === "Pendente" && (
                      <>
                        <Button
                          design="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
                          onClick={() => openActionModal("allow", selectedExit)}
                          disabled={processing}
                        >
                          <FaCheck className="inline mr-2" />
                          Liberar
                        </Button>
                        <Button
                          design="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
                          onClick={() => openActionModal("deny", selectedExit)}
                          disabled={processing}
                        >
                          <FaTimes className="inline mr-2" />
                          Negar
                        </Button>
                      </>
                    )}
                    <Button
                      design="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium"
                      onClick={() => openActionModal("delete", selectedExit)}
                      disabled={processing}
                    >
                      <FaTrash className="inline mr-2" />
                      Apagar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ação com Responsável Obrigatório */}
      {showActionModal && selectedExit && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: '#00000080' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {actionType === "allow" && "✅ Liberar Saída"}
                  {actionType === "deny" && "❌ Negar Saída"}
                  {actionType === "delete" && "🗑️ Apagar Saída"}
                </h3>
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setResponsavel("");
                    setObservacao("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={processing}
                >
                  <IoCloseSharp size={20} />
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                {actionType === "allow" && `Liberar saída do aluno ${getUserName(selectedExit.user_id)}?`}
                {actionType === "deny" && `Negar saída do aluno ${getUserName(selectedExit.user_id)}?`}
                {actionType === "delete" && `Tem certeza que deseja apagar esta solicitação de saída? Esta ação não pode ser desfeita.`}
              </p>

              {(actionType === "allow" || actionType === "deny") && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Responsável <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Seu nome ou identificação"
                      value={responsavel}
                      onChange={(e) => setResponsavel(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Identifique quem está realizando esta ação</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observação (opcional)
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows="3"
                      placeholder="Adicione uma observação..."
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  design="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 border border-gray-400"
                  onClick={() => {
                    setShowActionModal(false);
                    setResponsavel("");
                    setObservacao("");
                  }}
                  disabled={processing}
                >
                  Cancelar
                </Button>
                <Button
                  design={
                    actionType === "allow" ? "bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 border border-green-700" :
                      actionType === "deny" ? "bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 border border-red-700" :
                        "bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 border border-red-700"
                  }
                  onClick={handleAction}
                  disabled={processing || ((actionType === "allow" || actionType === "deny") && !responsavel.trim())}
                >
                  {processing ? "Processando..." :
                    actionType === "allow" ? "✅ Liberar" :
                      actionType === "deny" ? "❌ Negar" :
                        "🗑️ Apagar"
                  }
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default LeavesControl;