import { useState } from "react";
import { useNavigate } from "react-router-dom";

// icons
import { User, GraduationCap } from "lucide-react";

function SelectRole() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);

    setTimeout(() => {
      // redireciona para a página de confirmação de CPF, informando o cargo
      navigate("/confirmar-cpf", { state: { role } });
    }, 500);
  };

  return (
    <div className="w-full mx-auto">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Botão Sou Funcionário */}
        <button
          onClick={() => handleRoleSelect("funcionario")}
          className={`group p-6 border-2 border-blue-800 rounded-lg transition-all duration-300 flex flex-col items-center justify-center gap-4 min-h-[200px]
            ${
              selectedRole === "funcionario"
                ? "border-red-600 bg-red-50 shadow-lg transform scale-105"
                : "border-blue-800 bg-white hover:bg-blue-800 hover:shadow-md"
            }`}
        >
          <div
            className={`p-4 rounded-full transition-all
              ${
                selectedRole === "funcionario"
                  ? "bg-red-600"
                  : "bg-transparent group-hover:bg-blue-800"
              }`}
          >
            <User
              size={32}
              className={`transition-all
                ${
                  selectedRole === "funcionario"
                    ? "text-black"
                    : "text-blue-800 group-hover:text-white"
                }`}
            />
          </div>

          <h3
            className={`text-xl font-semibold transition-all
              ${
                selectedRole === "funcionario"
                  ? "text-white"
                  : "text-gray-900 group-hover:text-white"
              }`}
          >
            Sou funcionário
          </h3>

          {selectedRole === "funcionario" && (
            <p className="text-sm text-gray-600 text-center mt-2">
              Notificado, professor: 978-0-3-1-2
            </p>
          )}
        </button>

        {/* Botão Sou Aluno */}
        <button
          onClick={() => handleRoleSelect("aluno")}
          className={`group p-6 border-2 rounded-lg transition-all duration-300 flex flex-col items-center justify-center gap-4 min-h-[200px]
            ${
              selectedRole === "aluno"
                ? "border-red-600 bg-red-50 shadow-lg transform scale-105"
                : "border-red-600 bg-white hover:bg-red-600 hover:shadow-md"
            }`}
        >
          <div
            className={`p-4 rounded-full transition-all
              ${selectedRole === "aluno" ? "bg-red-600" : "bg-transparent"}`}
          >
            <GraduationCap
              size={32}
              className={`transition-all
                ${
                  selectedRole === "aluno"
                    ? "text-white"
                    : "text-red-600 group-hover:text-white"
                }`}
            />
          </div>

          <h3
            className={`text-xl font-semibold transition-all
              ${
                selectedRole === "aluno"
                  ? "text-red-600"
                  : "text-gray-800 group-hover:text-white"
              }`}
          >
            Sou aluno
          </h3>

          {selectedRole === "aluno" && (
            <p className="text-sm text-gray-600 text-center mt-2">
              Expedindo: 02/4/16
            </p>
          )}
        </button>
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-500 text-sm p-5">
          Clique em uma das opções acima para continuar com seu primeiro acesso
        </p>
      </div>

      {selectedRole && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-red-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
            <span>Redirecionando...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectRole;
