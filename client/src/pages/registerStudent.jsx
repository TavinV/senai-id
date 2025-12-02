import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import useUsers from "../hooks/useUsers.jsx";
import { toast } from "react-toastify";

// Components
import LoggedHeader from "../components/layout/loggedHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import { FormContainer } from "../components/containers/formContainer.jsx";
import FormRow from "../components/layout/formRow.jsx";
import { IconInput } from "../components/inputs/iconInput.jsx";
import { IconSelect } from "../components/inputs/iconSelect.jsx";
import { FileInput } from "../components/inputs/fileInput.jsx";
import Carteirinha from "../components/ui/carteirinha.jsx";
import Footer from "../components/layout/footer.jsx";

// Icons
import {
  User,
  SquareUser,
  GraduationCap,
  Calendar,
  Wrench,
} from "lucide-react";

// util
import maskCPF from "../util/maskCpf.js";

function RegisterStudent() {
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    cpf: "",
    data_nascimento: "",
    curso: "",
    turma: "",
    cargo: "aluno",
    foto_perfil: null
  });

  const [courses, setCourses] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);

  const { createStudent } = useUsers();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateOfBirthChange = (e) => {
    const date = new Date(e.target.value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    const formatted = `${year}-${month}-${day}`;
    handleInputChange("data_nascimento", formatted);
  };

  const handleCpfChange = (e) => {
    const maskedValue = maskCPF(e.target.value);
    handleInputChange("cpf", maskedValue);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleInputChange("foto_perfil", file);

    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await createStudent(formData);

      if (response?.success) {
        toast.success("Aluno cadastrado com sucesso!");

        setFormData({
          nome: "",
          matricula: "",
          cpf: "",
          data_nascimento: "",
          curso: "",
          turma: "",
          cargo: "aluno",
          foto_perfil: null
        });
        setPhotoPreview(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar aluno.");
    }
  };

  useEffect(() => {
    fetch("/cursos.json")
      .then(r => r.json())
      .then(data => {
        setCourses(
          data.map(curso => ({
            label: curso.nome,
            value: curso.nome,
          }))
        );
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <LoggedHeader />

      <MainContent className="flex p-5 flex-col md:flex-row gap-8">
        <FormContainer
          title="Cadastro de aluno"
          buttonText="Cadastrar"
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
              />
            </div>

            <div className="w-full md:w-[48%] flex flex-col gap-2">
              <h2>Data de nascimento</h2>
              <IconInput
                icon={<Calendar />}
                type="date"
                label="Data de nascimento"
                width="100%"
                onChange={handleDateOfBirthChange}
              />
            </div>
          </FormRow>

          <FormRow>
            <div className="w-full md:w-[48%] flex flex-col gap-2">
              <IconSelect
                icon={<Wrench />}
                options={courses}
                label="Curso"
                value={courses.find(opt => opt.value === formData.curso)}
                onChange={(selected) => handleInputChange("curso", selected.target.value)}
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

        <div className="hidden md:block">
          <Carteirinha
            photoPreview={photoPreview}
            name={formData.nome || "Nome do Estudante"}
            dateOfBirth={formData.data_nascimento || "00/00/0000"}
            course={formData.curso || ""}
            matricula={formData.matricula || "00000000"}
            cpf={formData.cpf || "000.000.000-00"}
            showQrButton={false}
          />
        </div>
      </MainContent>

      <Footer />
    </div>
  );
}

export default RegisterStudent;
