import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Components
import UserHeader from "../components/layout/userHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import { FormContainer } from "../components/containers/formContainer.jsx";
import FormRow from "../components/layout/formRow.jsx";
import { IconInput } from "../components/inputs/iconInput.jsx";
import Footer from "../components/layout/footer.jsx";
import LoadingScreen from "../components/ui/loadingScreen.jsx";

// Icons
import { Clock, FileText } from "lucide-react";

// Context & Services
import { useAuthContext } from "../context/authContext.jsx";
import api from "../services/api.js";

function AskForDelay() {
  const { user, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    motivo: "",
    observacoes: "",
  });
  const [loading, setLoading] = useState(false);

  // Redireciona se não for aluno
  if (!authLoading && user && user.cargo?.toLowerCase() !== "aluno") {
    navigate("/carteirinha");
    return null;
  }

  // Mostra loading enquanto verifica autenticação
  if (authLoading) return <LoadingScreen />;

  // Redireciona se não estiver logado
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validação
    if (!formData.motivo.trim()) {
      toast.error("Por favor, informe o motivo da requisição.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        motivo: formData.motivo,
        observacoes: formData.observacoes || "",
        user_id: user._id,
        nome_aluno: user.nome,
        matricula: user.matricula,
        curso: user.curso,
      };

      const response = await api.post("/delay-request", payload);

      if (response.data.success || response.status === 201) {
        toast.success("Requisição de liberação enviada com sucesso!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Limpa o formulário
        setFormData({
          motivo: "",
          observacoes: "",
        });

        // Redireciona após 2 segundos
        setTimeout(() => {
          navigate("/carteirinha");
        }, 2000);
      } else {
        toast.error("Erro ao enviar requisição. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao processar sua requisição. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <UserHeader />

      <MainContent className="flex flex-col items-center justify-center py-8">
        <FormContainer
          title="Requisição de Atraso"
          buttonText="Enviar Requisição"
          loadingText="Enviando..."
          loading={loading}
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-6">
            {/* Motivo */}
            <span>
              <h2 className="text-sm font-semibold mb-2">Motivo da Requisição *</h2>
              <select
                value={formData.motivo}
                onChange={(e) => handleInputChange("motivo", e.target.value)}
                className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-300 transition"
              >
                <option value="">Selecione o motivo</option>
                <option value="Atraso no transporte">Atraso no transporte</option>
                <option value="Motivo médico">Motivo médico</option>
                <option value="Assunto familiar">Assunto familiar</option>
                <option value="Questão de trabalho">Questão de trabalho</option>
                <option value="Outro">Outro</option>
              </select>
            </span>

            {/* Observações */}
            <span>
              <h2 className="text-sm font-semibold mb-2">Observações Adicionais</h2>
              <textarea
                value={formData.observacoes}
                onChange={(e) => handleInputChange("observacoes", e.target.value)}
                placeholder="Descreva melhor sua situação (opcional)"
                className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-300 transition resize-vertical min-h-[100px]"
              />
            </span>
          </div>
        </FormContainer>
      </MainContent>

      <Footer />
    </div>
  );
}

export default AskForDelay;
