import { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import Header from "../components/layout/header.jsx";
import Footer from "../components/layout/footer.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import AlertMessage from "../components/ui/alertMessage.jsx";
import { IconInput } from "../components/inputs/iconInput.jsx";
import { FormContainer } from "../components/containers/formContainer.jsx";

// icons
import { GraduationCap, UserCheck } from "lucide-react";
import api from "../services/api";

// util
import maskCPF from "../util/maskCpf.js";

function ConfirmCpf() {
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // role pode vir via state (ex: { role: 'aluno' }) ou query string
  const roleFromState =
    location.state?.role || new URLSearchParams(location.search).get("role");
  const role = roleFromState || "aluno"; // default para aluno

  const handleCpfChange = (e) => {
    setCpf(maskCPF(e.target.value));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    // validação simples de formato: 14 chars (000.000.000-00)
    if (!cpf || cpf.replace(/\D/g, "").length !== 11) {
      setError("Por favor insira um CPF válido.");
      return;
    }

    setLoading(true);

    try {
      // Chamar o endpoint especificado: GET /users/:CPF/first-access
      const normalizedCpf = cpf.replace(/\D/g, "");
      const response = await api.get(`/users/${normalizedCpf}/first-access`);
      const data = response.data?.data;

      if (!data) {
        setError("Nenhuma conta encontrada para este CPF.");
        return;
      }

      // `data` deve conter login (CPF) e senha padrão conforme definido
      const mapped = {
        login: data.cpf || cpf,
        senha_padrao: data.senha || data.senha_padrao || "",
        cargo: role,
        nome: data.nome,
      };

      setModalUser(mapped);
      setShowModal(true);
    } catch (err) {
      setError("Erro ao consultar o servidor. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <MainContent>
        <FormContainer
          buttonText="Confirmar"
          onSubmit={handleSubmit}
          loading={loading}
          loadingText={"Verificando..."}
        >
          <div className="max-w-3xl mx-auto px-6 w-full ">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Confirme seu CPF
              </h1>
              <p className="text-gray-600 mt-2">
                Informe o CPF para continuarmos e acessar a sua carteirinha.
                Tipo: <strong className="capitalize">{role}</strong>
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <h2>CPF</h2>
                <IconInput
                  maxLength={14}
                  icon={<GraduationCap />}
                  placeholder="123.456.789-00"
                  type="text"
                  value={cpf}
                  onChange={handleCpfChange}
                />
              </div>

              {error && (
                <AlertMessage
                  type="error"
                  message={error}
                  onClose={() => setError(null)}
                />
              )}

              <div className="flex justify-between items-center">
                <NavLink
                  to="/Primeiro-acesso"
                  className="text-sm text-gray-600 hover:underline"
                >
                  Voltar
                </NavLink>
              </div>
            </div>
          </div>
        </FormContainer>
        {/* Modal simples */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowModal(false)}
            ></div>

            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-green-50 text-green-600">
                  <UserCheck size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Usuário verificado</h3>
                  <p className="text-sm text-gray-600 ">
                    Encontramos uma conta associada a esse CPF.
                  </p>
                </div>
              </div>

              <div className="mt-1 border rounded-md p-7 flex flex-row justify-between items-center bg-gray-50">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-500 mt-3">Nome</div>
                  <div className="font-medium mt-2">{modalUser.nome}</div>

                  <div className="text-sm text-gray-500 mt-3">Cargo</div>
                  <div className="font-medium mt-2">{role}</div>
                </div>

                <div className="flex flex-col text-right">
                  <div className="text-sm text-gray-500 mt-3">Login</div>
                  <div className="font-medium mt-2">{modalUser.login}</div>

                  <div className="text-sm text-gray-500 mt-3">Senha</div>
                  <div className="font-medium mt-2"></div>
                  {modalUser.senha_padrao}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    navigate("/login", {
                      state: {
                        cpf: modalUser.login,
                        password: modalUser.senha_padrao || modalUser.senha,
                      },
                    });
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold"
                >
                  Realizar login agora
                </button>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setCpf("");
                    setModalUser(null);
                  }}
                  className="w-full border border-gray-300 py-3 rounded-md bg-white hover:bg-gray-50"
                >
                  Confirmar outro CPF
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

export default ConfirmCpf;
