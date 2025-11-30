import { useState, useEffect } from "react";
import useUsers from "../hooks/useUsers";

// Components
import LoggedHeader from "../components/layout/loggedHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import { FormContainer } from "../components/containers/formContainer.jsx";
import FormRow from "../components/layout/formRow.jsx";
import { IconInput } from "../components/inputs/iconInput.jsx";
import { FileInput } from "../components/inputs/fileInput.jsx";
import { IconSelect } from "../components/inputs/iconSelect.jsx";
import Carteirinha from "../components/ui/carteirinha.jsx";
import Footer from "../components/layout/footer.jsx";

// Icons
import {
  User,
  SquareUser,
  BriefcaseBusiness,
  IdCardLanyard,
  Mail,
} from "lucide-react";

// utils
import maskCPF from "../util/maskCpf.js";
import toast, { Toaster } from "react-hot-toast";

function RegisterEmployee() {

  const { createEmployee, loading } = useUsers();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    pis: "",
    nif: "",
    email: "",
    descricao: "",
    foto_perfil: null,
  });

  const [cargos, setCargos] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);

  // carregar cargos do json COMO ANTES
  useEffect(() => {
    fetch("/cargos.json")
      .then((res) => res.json())
      .then((data) => {
        const options = data.map((cargo) => ({
          value: cargo.nome,
          label: cargo.nome,
        }));
        setCargos(options);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCpfChange = (e) => {
    handleInputChange("cpf", maskCPF(e.target.value));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleInputChange("foto_perfil", file);

    // FUNCIONANDO NOVAMENTE
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async () => {
    if (loading) return;

    // validações
    const requiredFields = ["nome", "cpf", "pis", "nif", "email", "descricao"];
    if (requiredFields.some((f) => !formData[f])) {
      console.log("Faltam campos obrigatórios, formData:", formData);
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    if (!formData.foto_perfil) {
      toast.error("A foto do funcionário é obrigatória!");
      return;
    }

    if (formData.cpf.length !== 14) {
      toast.error("CPF inválido!");
      return;
    }

    if (formData.pis.length !== 11) {
      toast.error("PIS deve conter 11 dígitos!");
      return;
    }

    const res = await createEmployee(formData);

    if (res?.success) {
      toast.success("Funcionário cadastrado com sucesso!");
      setFormData({
        nome: "",
        cpf: "",
        pis: "",
        nif: "",
        email: "",
        descricao: "",
        foto_perfil: null,
      });
      setPhotoPreview(null);
    } else {
      toast.error(res?.message || "Erro ao cadastrar funcionário!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <LoggedHeader />
      <Toaster position="bottom-right" />

      <MainContent className="flex p-5 flex-col md:flex-row gap-8 ">
        <FormContainer
          title="Cadastro de Funcionário"
          theme="employee"
          buttonText={loading ? "Cadastrando..." : "Cadastrar"}
          width="3xl"
          onSubmit={() => handleSubmit()}  // 🔥 FIX: sem preventDefault manual
          className="px-4 md:px-0"
        >
          <FormRow className="flex-col md:flex-row">
            <div className="w-full md:w-[48%] flex flex-col gap-2">
              <h2>Nome completo*</h2>
              <IconInput
                icon={<User />}
                placeholder="Digite o nome completo"
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
              />
            </div>

            <div className="w-full md:w-[48%] flex flex-col gap-2">
              <h2>CPF*</h2>
              <IconInput
                icon={<SquareUser />}
                placeholder="Digite o CPF"
                type="text"
                maxLength="14"
                onChange={handleCpfChange}
                value={formData.cpf}
              />
            </div>
          </FormRow>

          <FormRow>
            <div className="w-full md:w-[48%] flex flex-col gap-2">
              <h2>NIF*</h2>
              <IconInput
                icon={<BriefcaseBusiness />}
                placeholder="Digite o NIF"
                type="text"
                maxLength="8"
                value={formData.nif}
                onChange={(e) => handleInputChange("nif", e.target.value)}
              />
            </div>

            <div className="w-full md:w-[48%] flex flex-col gap-2">
              <h2>PIS*</h2>
              <IconInput
                icon={<IdCardLanyard />}
                placeholder="Insira o PIS"
                type="text"
                maxLength={11}
                value={formData.pis}
                onChange={(e) => handleInputChange("pis", e.target.value)}
              />
            </div>
          </FormRow>

          <FormRow>
            <div className="w-full flex flex-col gap-2">
              <h2>Email*</h2>
              <IconInput
                icon={<Mail />}
                placeholder="exemplo@email.com"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </FormRow>

          {/* 🔥 Mantido exatamente igual ao ORIGINAL */}
          <FormRow>
            <div className="w-full flex flex-col gap-2">
              <h2>Cargo*</h2>
              <IconSelect
                icon={<BriefcaseBusiness />}
                options={cargos}
                value={cargos.find(opt => opt.value === formData.descricao)}
                onChange={(selectedOption) => {
                  // Mantido do jeito que funcionava
                  console.log("Cargo selecionado:", formData.descricao);
                  handleInputChange("descricao", selectedOption?.target?.value);
                }}
                placeholder="Selecione um cargo"
              />
            </div>
          </FormRow>

          <FormRow className="flex-col md:flex-row">
            <div className="w-full flex flex-col gap-5">
              <label className="text-gray-700 font-medium">
                Foto do Funcionário*
              </label>
              <div className="flex items-center flex-col sm:flex-row gap-4">
                <img
                  src={photoPreview || "/placeholder-foto.png"}
                  className="w-32 h-32 rounded-full object-cover bg-gray-800"
                  alt="Pré-visualização"
                />
                <FileInput onChange={handleImageChange} />
              </div>
            </div>
          </FormRow>
        </FormContainer>

        <div className="hidden md:block">
          <Carteirinha
            photoPreview={photoPreview}
            name={formData.nome || "Nome do Funcionário"}
            cpf={formData.cpf || "000.000.000-00"}
            nif={formData.nif || "00000000"}
            pis={formData.pis || "00000000000"}
            type="funcionario"
            role={formData.descricao || "Descrição"}
            showQrButton={false}
          />
        </div>
      </MainContent>

      <Footer />
    </div>
  );
}

export default RegisterEmployee;
