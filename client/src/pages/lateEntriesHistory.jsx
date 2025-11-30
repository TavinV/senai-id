import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import UserHeader from "../components/layout/userHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import Footer from "../components/layout/footer.jsx";
import LoadingScreen from "../components/ui/loadingScreen.jsx";

// Icons
import { AlertCircle, CheckCircle, X } from "lucide-react";

// Context & Services
import { useAuthContext } from "../context/authContext.jsx";

function LateEntriesHistory() {
  const { user, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("todos");
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Dados fictícios que serão substituídos pelo hook useLateEntries
  const [lateEntries] = useState([
    {
      _id: "689e88aae7ba007fe17a53e5",
      id: "gUgay83d",
      user_id: "7w38zulvm4fmeapb7v9",
      status: "Validado",
      motivo: "Trânsito à caminho do senai",
      responsavel: "Lucas",
      observacao: "",
      createdAt: "2025-08-15T01:08:59.011Z",
      updatedAt: "2025-08-15T01:09:57.739Z",
    },
    {
      _id: "689e88aae7ba007fe17a53e6",
      id: "gUgay83e",
      user_id: "7w38zulvm4fmeapb7v9",
      status: "Pendente",
      motivo: "Problema com transporte",
      responsavel: null,
      observacao: "Aguardando aprovação",
      createdAt: "2025-11-28T10:30:00.011Z",
      updatedAt: "2025-11-28T10:30:00.011Z",
    },
    {
      _id: "689e88aae7ba007fe17a53e7",
      id: "gUgay83f",
      user_id: "7w38zulvm4fmeapb7v9",
      status: "Recusado",
      motivo: "Desculpa não justificável",
      responsavel: "Maria",
      observacao: "Atraso recorrente",
      createdAt: "2025-11-20T14:45:30.011Z",
      updatedAt: "2025-11-20T15:20:10.011Z",
    },
  ]);

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

  // Filtrar dados baseado na seleção
  const filteredEntries =
    filter === "todos"
      ? lateEntries
      : lateEntries.filter((entry) => entry.status.toLowerCase() === filter.toLowerCase());

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
      case "validado":
        return <CheckCircle size={18} />;
      case "pendente":
        return <AlertCircle size={18} />;
      case "recusado":
        return <AlertCircle size={18} />;
      default:
        return <AlertCircle size={18} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <UserHeader />
      <MainContent>
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          {/* Title Section */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Histórico de Atrasos
            </h1>
            <p className="text-gray-600 text-lg">
              Acompanhe todas as suas requisições e seus status de aprovação
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-8">
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
                Validados ({lateEntries.filter((e) => e.status.toLowerCase() === "validado").length})
              </button>
              <button
                onClick={() => setFilter("pendente")}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === "pendente"
                    ? "bg-yellow-500 text-white shadow-md"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-yellow-500"
                }`}
              >
                Pendentes ({lateEntries.filter((e) => e.status.toLowerCase() === "pendente").length})
              </button>
              <button
                onClick={() => setFilter("recusado")}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === "recusado"
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-600"
                }`}
              >
                Recusados ({lateEntries.filter((e) => e.status.toLowerCase() === "recusado").length})
              </button>
            </div>
          </div>

          {/* Count Section */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-700 font-semibold">
              Mostrando <span className="text-red-500">{filteredEntries.length}</span> de <span className="text-red-500">{lateEntries.length}</span> registros
            </p>
          </div>

          {/* Entries List */}
          <div className="space-y-4">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
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
                          <span>{entry.status}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {entry.motivo}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-medium mb-1">Data da Requisição</p>
                          <p className="text-gray-800">{formatDate(entry.createdAt)}</p>
                        </div>

                        {entry.responsavel && (
                          <div>
                            <p className="text-gray-600 font-medium mb-1">Responsável</p>
                            <p className="text-gray-800">{entry.responsavel}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="md:w-32">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
                <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Nenhum registro encontrado
                </h3>
                <p className="text-gray-600">
                  Você não tem atrasos registrados com este filtro.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Detalhes */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-linear-to-r from-red-500 to-red-600 text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Detalhes do Atraso</h2>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="hover:bg-red-700 p-2 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-semibold">Status:</span>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold ${getStatusColor(
                      selectedEntry.status
                    )}`}
                  >
                    {getStatusIcon(selectedEntry.status)}
                    <span>{selectedEntry.status}</span>
                  </div>
                </div>

                {/* ID */}
                <div>
                  <p className="text-gray-600 font-semibold mb-2">ID da Requisição</p>
                  <p className="text-gray-800 text-lg font-mono bg-gray-50 p-3 rounded-lg">
                    {selectedEntry.id}
                  </p>
                </div>

                {/* Motivo */}
                <div>
                  <p className="text-gray-600 font-semibold mb-2">Motivo</p>
                  <p className="text-gray-800 text-lg">{selectedEntry.motivo}</p>
                </div>

                {/* Datas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 font-semibold mb-2">Data da Requisição</p>
                    <p className="text-gray-800">{formatDate(selectedEntry.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold mb-2">Última Atualização</p>
                    <p className="text-gray-800">{formatDate(selectedEntry.updatedAt)}</p>
                  </div>
                </div>

                {/* Responsável */}
                {selectedEntry.responsavel && (
                  <div>
                    <p className="text-gray-600 font-semibold mb-2">Responsável pela Análise</p>
                    <p className="text-gray-800">{selectedEntry.responsavel}</p>
                  </div>
                )}

                {/* Observação */}
                {selectedEntry.observacao && (
                  <div>
                    <p className="text-gray-600 font-semibold mb-2">Observações</p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-gray-800">{selectedEntry.observacao}</p>
                    </div>
                  </div>
                )}

                {/* Info Adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Informação:</span> Para maiores informações sobre sua requisição, entre em contato com a secretaria.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 border-t border-gray-200 p-6 flex gap-4">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Fechar
                </button>
                <button className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold">
                  Entrar em Contato
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

export default LateEntriesHistory;
