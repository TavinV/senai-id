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

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById, updateUser, loading } = UseUsers();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    matricula: "",
    data_nascimento: "",
    curso: "",
    foto_perfil: "",
  });
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const user = await getUserById(id);
      if (user) {
        setFormData({
          nome: user.nome || "",
          cpf: user.cpf || "",
          matricula: user.matricula || "",
          data_nascimento: user.data_nascimento || "",
          curso: user.curso || "",
          foto_perfil: user.foto_perfil || "",
        });
        setPhotoPreview(user.foto_perfil || "");
      }
    }
    fetchUser();
    // eslint-disable-next-line
  }, [id]);

  const handleInputChange = (field, value) => {
    const newValue = field === "cpf" ? maskCPF(value) : value;
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview locally
    const imageURL = URL.createObjectURL(file);
    setPhotoPreview(imageURL);

    // Save the File object so updateUser() can send FormData
    setFormData((prev) => ({ ...prev, foto_perfil: file }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateUser(id, formData);
    if (success) {
      toast.success("Dados atualizados com sucesso!");
      navigate("/usuarios");
    } else {
      toast.error("Erro ao atualizar dados.");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <LoggedHeader />
      <MainContent className="flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl mt-10">
          <h2 className="text-2xl font-bold mb-6 text-red-600">
            Editar Dados do Usuário
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="font-semibold">Nome</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 mt-1"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="font-semibold">CPF</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 mt-1"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange("cpf", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="font-semibold">Matrícula</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 mt-1"
                  value={formData.matricula}
                  onChange={(e) =>
                    handleInputChange("matricula", e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex-1">
                <label className="font-semibold">Data de Nascimento</label>
                <input
                  type="date"
                  className="w-full border rounded-md p-2 mt-1"
                  value={formData.data_nascimento?.slice(0, 10)}
                  onChange={(e) =>
                    handleInputChange("data_nascimento", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="font-semibold">Curso</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 mt-1"
                  value={formData.curso}
                  onChange={(e) => handleInputChange("curso", e.target.value)}
                  required
                />
              </div>
              <div className="flex-1 flex flex-col items-center">
                <label className="font-semibold">Foto de Perfil</label>
                <img
                  src={photoPreview || "/placeholder-foto.png"}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover mb-2 mt-1"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <Button
                type="button"
                design="bg-gray-200 text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-300"
                onClick={() => navigate("/contas")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                design="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Confirmar Alterações"}
              </Button>
            </div>
          </form>
        </div>
      </MainContent>
      <Footer />
    </div>
  );
};

export default EditUser;
