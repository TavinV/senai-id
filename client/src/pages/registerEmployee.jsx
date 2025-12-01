import { useState, useEffect } from "react";
import api, { setAuthToken } from "../services/api";

// Components (mantive seus componentes)
import LoggedHeader from "../components/layout/loggedHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import { FormContainer } from "../components/containers/formContainer.jsx";
import FormRow from "../components/layout/formRow.jsx";
import { IconInput } from "../components/inputs/iconInput.jsx";
import { FileInput } from "../components/inputs/fileInput.jsx";
import Carteirinha from "../components/ui/carteirinha.jsx";
import Footer from "../components/layout/footer.jsx";

import { User, SquareUser, BriefcaseBusiness, IdCardLanyard, Mail } from "lucide-react";
import maskCPF from "../util/maskCpf.js";
import toast, { Toaster } from "react-hot-toast";

function generatePassword(cpf) {
  const lastTwo = cpf.replace(/\D/g, "").slice(-2);
  return `senai117@${lastTwo}`;
}

export default function RegisterEmployee() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "Fulano de tal",
    cpf: "000.000.000-00",
    pis: "12345678901",
    nif: "12345678",
    email: "fulano@example.com",
    descricao: "Descrição do funcionário",
    foto_perfil: null,
  });

  const [cargos, setCargos] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    fetch("/cargos.json")
      .then((r) => r.json())
      .then((data) => setCargos(data.map(c => ({ value: c.nome, label: c.nome }))))
      .catch(() => setCargos([]));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((s) => ({ ...s, [field]: value }));
  };

  const handleCpfChange = (e) => handleInputChange("cpf", maskCPF(e.target.value));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    handleInputChange("foto_perfil", file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  // NOVA FUNÇÃO: envia manualmente e faz logs detalhados
  const handleSubmit = async () => {
    if (loading) return;
    const required = ["nome", "cpf", "pis", "nif", "email", "descricao"];
    if (required.some((f) => !formData[f])) return toast.error("Preencha todos os campos obrigatórios!");
    if (!formData.foto_perfil) return toast.error("Foto obrigatória!");

    try {
      setLoading(true);

      // garante Authorization no axios (usa helper para consistência)
      const token = localStorage.getItem("jwtToken");
      if (token) setAuthToken(token);

      // monta FormData corretamente
      const form = new FormData();
      form.append("nome", formData.nome);
      form.append("cpf", formData.cpf);
      form.append("senha", generatePassword(formData.cpf));
      form.append("descricao", formData.descricao);
      form.append("nif", formData.nif);
      form.append("pis", formData.pis);
      form.append("email", formData.email);
      form.append("foto_perfil", formData.foto_perfil);

      // DEBUG: inspeciona FormData antes de enviar
      console.log(">>> ENVIANDO FormData entries:");
      for (const pair of form.entries()) {
        // para arquivo, imprime tipo e name mas não conteúdo
        if (pair[1] instanceof File) {
          console.log(pair[0], ": File(name=", pair[1].name, ", size=", pair[1].size, ", type=", pair[1].type, ")");
        } else {
          console.log(pair[0], ": ", pair[1]);
        }
      }
      // opcional: confirma form.get('foto_perfil')
      console.log("form.get('foto_perfil') =", form.get("foto_perfil"));

      // NÃO definir Content-Type manualmente — deixa o browser setar a boundary
      const res = await api.post("/users/employees", form);

      // log completo da resposta
      console.log("POST /users/employees resposta:", res.status, res.data);
      toast.success("Funcionário cadastrado!");
      // limpa
      setPhotoPreview(null);
      setFormData({ nome: "", cpf: "", pis: "", nif: "", email: "", descricao: "", foto_perfil: null });
    } catch (err) {
      // Erro Axios detalhado
      console.error("Erro no envio:", err);

      // Mostra informações úteis
      if (err?.response) {
        console.error("Resposta do servidor:", err.response.status, err.response.headers);
        try {
          console.error("Resposta do servidor (data):", JSON.stringify(err.response.data, null, 2));
        } catch (e) {
          console.error("Resposta do servidor (data):", err.response.data);
        }
        const serverMessage = err.response.data?.message || err.response.data || `Erro ${err.response.status}`;
        toast.error(Array.isArray(serverMessage) ? serverMessage.join(" \n") : String(serverMessage));
      } else if (err?.request) {
        console.error("Requisição enviada mas sem resposta (network/preflight):", err.request);
        toast.error("Erro de rede / preflight. Veja console Network.");
      } else {
        console.error("Erro ao montar requisição:", err.message);
        toast.error("Erro ao montar requisição");
      }
    } finally {
      setLoading(false);
    }
  };

  // RENDER - mantive sua estética
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <LoggedHeader />
      <Toaster position="bottom-right" />
      <MainContent className="flex p-5 flex-col md:flex-row gap-8">
        <FormContainer
          title="Cadastro de Funcionário"
          theme="employee"
          buttonText={loading ? "Cadastrando..." : "Cadastrar"}
          width="3xl"
          onSubmit={(e) => { e?.preventDefault?.(); handleSubmit(); }}
          className="px-4 md:px-0"
        >
          <FormRow className="flex-col md:flex-row">
            <div className="w-full md:w-[48%] flex flex-col gap-2">
              <h2>Nome completo*</h2>
              <IconInput icon={<User />} value={formData.nome} onChange={(e) => handleInputChange("nome", e.target.value)} placeholder="Digite o nome completo" />
            </div>
            <div className="w-full md:w-[48%] flex flex-col gap-2">
              <h2>CPF*</h2>
              <IconInput icon={<SquareUser />} value={formData.cpf} maxLength="14" onChange={handleCpfChange} placeholder="000.000.000-00" />
            </div>
          </FormRow>

          <FormRow>
            <div className="w-full md:w-[48%] flex flex-col gap-2">
              <h2>NIF*</h2>
              <IconInput icon={<BriefcaseBusiness />} value={formData.nif} maxLength="8" onChange={(e) => handleInputChange("nif", e.target.value)} placeholder="NIF" />
            </div>
            <div className="w-full md:w-[48%] flex flex-col gap-2">
              <h2>PIS*</h2>
              <IconInput icon={<IdCardLanyard />} value={formData.pis} maxLength="11" onChange={(e) => handleInputChange("pis", e.target.value)} placeholder="PIS" />
            </div>
          </FormRow>

          <FormRow>
            <div className="w-full flex flex-col gap-2">
              <h2>Email*</h2>
              <IconInput icon={<Mail />} type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="exemplo@email.com" />
            </div>
          </FormRow>

          {/* AQUI: use select nativo — elimina comportamento imprevisível */}
          <FormRow>
            <div className="w-full flex flex-col gap-2">
              <h2>Cargo*</h2>
              <select
                className="border rounded p-2"
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
              >
                <option value="">Selecione um cargo</option>
                {cargos.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </FormRow>

          <FormRow className="flex-col md:flex-row">
            <div className="w-full flex flex-col gap-5">
              <label className="text-gray-700 font-medium">Foto do Funcionário*</label>
              <div className="flex items-center flex-col sm:flex-row gap-4">
                <img src={photoPreview || "/placeholder.png"} className="w-32 h-32 rounded-full object-cover bg-gray-800" alt="preview" />
                {/* FileInput do seu projeto, mas também aceitamos input nativo pra debug */}
                <FileInput onChange={handleImageChange} />
                {/* botão nativo de debug (remova depois) */}
                <input style={{ display: 'none' }} id="nativeFile" type="file" onChange={handleImageChange} />
              </div>
            </div>
          </FormRow>
        </FormContainer>

        <div className="hidden md:block">
          <Carteirinha photoPreview={photoPreview} name={formData.nome} cpf={formData.cpf} nif={formData.nif} pis={formData.pis} type="funcionario" role={formData.descricao} showQrButton={false} />
        </div>
      </MainContent>
      <Footer />
    </div>
  );
}
