import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UseUsers from "../hooks/useUsers.jsx";
import maskCPF from "../util/maskCpf.js";
import LoggedHeader from "../components/layout/loggedHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import Footer from "../components/layout/footer.jsx";
import Button from "../components/ui/button.jsx";
import { toast } from "react-toastify";
import LoadingScreen from "../components/ui/loadingScreen.jsx";

// Importações para formulário de aluno
import { FormContainer } from "../components/containers/formContainer.jsx";
import FormRow from "../components/layout/formRow.jsx";
import { IconInput } from "../components/inputs/iconInput.jsx";
import { IconSelect } from "../components/inputs/iconSelect.jsx";
import { FileInput } from "../components/inputs/fileInput.jsx";
import Carteirinha from "../components/ui/carteirinha.jsx";

// Icons
import {
  User,
  SquareUser,
  GraduationCap,
  Calendar,
  Wrench,
  BriefcaseBusiness,
  IdCardLanyard,
  Mail,
} from "lucide-react";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById, updateUser, loading } = UseUsers();

  const [userType, setUserType] = useState(""); // "aluno" ou "funcionario"
  const [formData, setFormData] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [courses, setCourses] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Dados iniciais para formulários
  const initialStudentData = {
    nome: "",
    matricula: "",
    cpf: "",
    data_nascimento: "",
    curso: "",
    turma: "",
    cargo: "aluno",
    foto_perfil: null,
  };

  const initialEmployeeData = {
    nome: "",
    cpf: "",
    pis: "",
    nif: "",
    email: "",
    descricao: "",
    foto_perfil: null,
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoadingData(true);
        const user = await getUserById(id);

        if (user) {
          // Determina o tipo de usuário
          const type = user.cargo === "aluno" ? "aluno" : "funcionario";
          setUserType(type);

          // Preenche os dados conforme o tipo
          if (type === "aluno") {
            // Para formatar a data de "DD/MM/YYYY" para "YYYY-MM-DD" em uma linha:
            const formated_data_nascimento = user.data_nascimento?.split('/').reverse().join('-') || "";

            setFormData({
              nome: user.nome || "",
              matricula: user.matricula || "",
              cpf: user.cpf || "",
              data_nascimento: formated_data_nascimento,
              curso: user.curso || "",
              turma: user.turma || "",
              cargo: user.cargo || "aluno",
              foto_perfil: user.foto_perfil || "",
            });
          } else {
            setFormData({
              nome: user.nome || "",
              cpf: user.cpf || "",
              pis: user.pis || "",
              nif: user.nif || "",
              email: user.email || "",
              descricao: user.descricao || "",
              foto_perfil: user.foto_perfil || "",
            });
          }

          setPhotoPreview(user.foto_perfil || "");
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        toast.error("Erro ao carregar dados do usuário");
      } finally {
        setLoadingData(false);
      }
    }

    fetchUser();
    // eslint-disable-next-line
  }, [id]);

  // Carrega cursos e cargos
  useEffect(() => {
    if (userType === "aluno") {
      fetch("/cursos.json")
        .then(r => r.json())
        .then(data => {
          setCourses(
            data.map(curso => ({
              label: curso.nome,
              value: curso.nome,
            }))
          );
        })
        .catch(() => setCourses([]));
    } else if (userType === "funcionario") {
      fetch("/cargos.json")
        .then(r => r.json())
        .then(data => {
          setCargos(data.map(c => ({ value: c.nome, label: c.nome })));
        })
        .catch(() => setCargos([]));
    }
  }, [userType]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCpfChange = (e) => {
    const maskedValue = maskCPF(e.target.value);
    handleInputChange("cpf", maskedValue);
  };

  const handleDateOfBirthChange = (e) => {
    const date = new Date(e.target.value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    const formatted = `${year}-${month}-${day}`;
    handleInputChange("data_nascimento", formatted);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview local
    const imageURL = URL.createObjectURL(file);
    setPhotoPreview(imageURL);

    // Salva o arquivo
    handleInputChange("foto_perfil", file);
  };

  const handleSubmit = async () => {

    if (!formData) return;

    try {
      const success = await updateUser(id, formData, userType);
      if (success) {
        toast.success("Dados atualizados com sucesso!");
        navigate("/usuarios");
      } else {
        toast.error("Erro ao atualizar dados.");
      }
    } catch (error) {
      console.error("Erro no submit:", error);
      toast.error("Erro ao atualizar dados.");
    }
  };

  // Renderizar formulário de aluno
  const renderStudentForm = () => (
    <FormContainer
      title="Editar Aluno"
      buttonText={loading ? "Salvando..." : "Salvar Alterações"}
      width="3xl"
      onSubmit={handleSubmit}
      className="px-4 md:px-0"
    >
      <FormRow className="flex-col md:flex-row">
        <div className="w-full md:w-[48%] flex flex-col gap-2">
          <h2>Nome completo</h2>
          <IconInput
            icon={<User />}
            placeholder="Digite o nome completo"
            type="text"
            label="Nome"
            value={formData.nome}
            onChange={(e) => handleInputChange("nome", e.target.value)}
            required
          />
        </div>

        <div className="w-full md:w-[48%] flex flex-col gap-2">
          <h2>CPF</h2>
          <IconInput
            icon={<SquareUser />}
            placeholder="Digite o CPF"
            type="text"
            onChange={handleCpfChange}
            value={formData.cpf}
            maxLength="14"
            label="CPF"
            required
          />
        </div>
      </FormRow>

      <FormRow className="flex-col md:flex-row">
        <div className="w-full md:w-[48%] flex flex-col gap-2">
          <h2>Matrícula</h2>
          <IconInput
            icon={<GraduationCap />}
            placeholder="Digite a matrícula"
            maxLength="8"
            type="text"
            inputMode="numeric"
            label="Matrícula"
            value={formData.matricula}
            onChange={(e) => handleInputChange("matricula", e.target.value)}
            required
          />
        </div>

        <div className="w-full md:w-[48%] flex flex-col gap-2">
          <h2>Data de nascimento</h2>
          <IconInput
            icon={<Calendar />}
            type="date"
            label="Data de nascimento"
            width="100%"
            value={formData.data_nascimento}
            onChange={handleDateOfBirthChange}
            required
          />
        </div>
      </FormRow>

      <FormRow className="flex-col md:flex-row">
        <div className="w-full md:w-[48%] flex flex-col gap-2">
          <h2>Curso</h2>
          <IconSelect
            icon={<Wrench />}
            options={courses}
            value={courses.find(opt => opt.value === formData.curso) || null}
            onChange={(selected) => handleInputChange("curso", selected?.value || "")}
          />
        </div>

        <div className="w-full md:w-[48%] flex flex-col gap-2">
          <h2>Turma</h2>
          <IconInput
            icon={<SquareUser />}
            placeholder="Digite a turma"
            type="text"
            label="Turma"
            value={formData.turma}
            onChange={(e) => handleInputChange("turma", e.target.value)}
          />
        </div>
      </FormRow>

      <FormRow>
        <div className="w-full flex flex-col gap-5">
          <label className="text-gray-700 font-medium">Foto do aluno</label>

          <div className="flex items-center flex-col sm:flex-row gap-4">
            <img
              src={photoPreview || "/placeholder-foto.png"}
              className="w-32 h-32 rounded-full object-cover bg-gray-800"
              alt="Preview"
            />

            <div className="flex flex-col text-center gap-6">
              <FileInput onChange={handleImageChange} />

              <span>
                <h3>{photoPreview ? "Foto selecionada" : "Nenhuma foto selecionada"}</h3>
                <h3>Arquivos suportados: JPG, PNG</h3>
              </span>
            </div>
          </div>
        </div>
      </FormRow>
    </FormContainer>
  );

  // Renderizar formulário de funcionário
  const renderEmployeeForm = () => (
    <FormContainer
      title="Editar Funcionário"
      theme="employee"
      buttonText={loading ? "Salvando..." : "Salvar Alterações"}
      width="3xl"
      onSubmit={handleSubmit}
      className="px-4 md:px-0"
    >
      <FormRow className="flex-col md:flex-row">
        <div className="w-full md:w-[48%] flex flex-col gap-2">
          <h2>Nome completo*</h2>
          <IconInput
            icon={<User />}
            value={formData.nome}
            onChange={(e) => handleInputChange("nome", e.target.value)}
            placeholder="Digite o nome completo"
            required
          />
        </div>
        <div className="w-full md:w-[48%] flex flex-col gap-2">
          <h2>CPF*</h2>
          <IconInput
            icon={<SquareUser />}
            value={formData.cpf}
            maxLength="14"
            onChange={handleCpfChange}
            placeholder="000.000.000-00"
            required
          />
        </div>
      </FormRow>

      <FormRow className="flex-col md:flex-row">
        <div className="w-full md:w-[48%] flex flex-col gap-2">
          <h2>NIF*</h2>
          <IconInput
            icon={<BriefcaseBusiness />}
            value={formData.nif}
            maxLength="8"
            onChange={(e) => handleInputChange("nif", e.target.value)}
            placeholder="NIF"
            required
          />
        </div>
        <div className="w-full md:w-[48%] flex flex-col gap-2">
          <h2>PIS*</h2>
          <IconInput
            icon={<IdCardLanyard />}
            value={formData.pis}
            maxLength="11"
            onChange={(e) => handleInputChange("pis", e.target.value)}
            placeholder="PIS"
            required
          />
        </div>
      </FormRow>

      <FormRow>
        <div className="w-full flex flex-col gap-2">
          <h2>Email*</h2>
          <IconInput
            icon={<Mail />}
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="exemplo@email.com"
            required
          />
        </div>
      </FormRow>

      <FormRow>
        <div className="w-full flex flex-col gap-2">
          <h2>Cargo*</h2>
          <select
            className="border rounded p-2 w-full"
            value={formData.descricao}
            onChange={(e) => handleInputChange("descricao", e.target.value)}
            required
          >
            <option value="">Selecione um cargo</option>
            {cargos.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </FormRow>

      <FormRow className="flex-col md:flex-row">
        <div className="w-full flex flex-col gap-5">
          <label className="text-gray-700 font-medium">Foto do Funcionário</label>
          <div className="flex items-center flex-col sm:flex-row gap-4">
            <img
              src={photoPreview || "/placeholder-foto.png"}
              className="w-32 h-32 rounded-full object-cover bg-gray-800"
              alt="Preview"
            />
            <div className="flex flex-col text-center gap-6">
              <FileInput onChange={handleImageChange} />
              <span>
                <h3>{photoPreview ? "Foto selecionada" : "Nenhuma foto selecionada"}</h3>
                <h3>Arquivos suportados: JPG, PNG</h3>
              </span>
            </div>
          </div>
        </div>
      </FormRow>
    </FormContainer>
  );

  // Renderizar carteirinha correspondente
  const renderCarteirinha = () => {
    if (userType === "aluno") {
      return (
        <Carteirinha
          photoPreview={photoPreview}
          name={formData?.nome || "Nome do Estudante"}
          dateOfBirth={formData?.data_nascimento || "00/00/0000"}
          course={formData?.curso || ""}
          matricula={formData?.matricula || "00000000"}
          cpf={formData?.cpf || "000.000.000-00"}
          showQrButton={false}
        />
      );
    } else if (userType === "funcionario") {
      return (
        <Carteirinha
          photoPreview={photoPreview}
          name={formData?.nome || "Nome do Funcionário"}
          cpf={formData?.cpf || "000.000.000-00"}
          nif={formData?.nif || "12345678"}
          pis={formData?.pis || "12345678901"}
          type="funcionario"
          role={formData?.descricao || ""}
          showQrButton={false}
        />
      );
    }
    return null;
  };

  if (loadingData) {
    return <LoadingScreen />;
  }

  if (!formData) {
    return (
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <LoggedHeader />
        <MainContent className="flex flex-col items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl mt-10">
            <h2 className="text-2xl font-bold mb-6 text-red-600">
              Usuário não encontrado
            </h2>
            <p className="mb-6">O usuário solicitado não foi encontrado.</p>
            <Button
              design="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
              onClick={() => navigate("/usuarios")}
            >
              Voltar para lista de usuários
            </Button>
          </div>
        </MainContent>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <LoggedHeader />

      <MainContent className="flex p-5 flex-col md:flex-row gap-8">
        {userType === "aluno" && renderStudentForm()}
        {userType === "funcionario" && renderEmployeeForm()}

        <div className="hidden md:block">
          {renderCarteirinha()}
        </div>
      </MainContent>

      <Footer />
    </div>
  );
};

export default EditUser;