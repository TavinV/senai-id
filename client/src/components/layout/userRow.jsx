import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const UserRow = ({ user }) => {
  const idValue = user.cargo === "funcionario" ? user.nif : user.matricula;
  const idLabel = user.cargo === "funcionario" ? "NIF" : "Matricula";
  const imageBorder =
    user.cargo === "funcionario"
      ? "border-2 border-blue-800"
      : user.cargo === "aluno"
      ? "border-2 border-red-600"
      : "border-2 border-gray-200";

  return (
    <div className="shadow bg-white grid grid-cols-5 items-center gap-20 border-t border-gray-300 p-6">
      {/* Usuário */}
      <div className="ml-10  flex items-center gap-4">
        <img
          src={user.foto_perfil}
          alt={`${user.nome} foto`}
          className={`w-14 h-14 rounded-full object-cover ${imageBorder}`}
        />
        <div>
          <p className="font-semibold text-gray-900">{user.nome}</p>
          <p className="text-sm text-gray-500">{user.email || "—"}</p>
        </div>
      </div>

      {/* ID */}
      <div className="ml-30">
        <p className="font-semibold text-gray-900">{idValue || "—"}</p>
        <p className="text-sm text-gray-500">{idLabel}</p>
      </div>

      {/* Status */}
      <div className="flex justify-center mr-10">
        <div
          className={`inline-flex px-3 py-1 rounded-full items-center
            ${user.cargo === "aluno" ? "bg-red-200 text-red-600" : ""}
            ${user.cargo === "funcionario" ? "bg-blue-200 text-blue-800" : ""}
            ${user.cargo === "secretaria" ? "bg-pink-200 text-pink-600" : ""}`}
        >
          <p className="font-bold text-sm">{user.cargo}</p>
        </div>
      </div>

      {/* Documento */}
      <div className="ml-15">
        <p className="font-semibold text-gray-900">{user.cpf || "—"}</p>
        <p className="text-sm text-gray-500">Documento</p>
      </div>

      {/* Ações */}
      <div className="mr-10  flex gap-3 justify-end">
        <button className="flex py-2 px-5 font-semibold gap-2 text-[1.05em] transition-all duration-300 rounded-xl items-center bg-gray-200 hover:bg-gray-300 hover:scale-105 focus:active:scale-95">
          <MdEdit className="text-2xl" />
          Editar
        </button>

        <button className="flex py-2 text-white px-5 font-semibold gap-2 text-[1.05em] transition-all duration-300 rounded-xl items-center bg-red-500 hover:bg-red-600 hover:scale-105 focus:active:scale-95">
          <MdDelete className="text-2xl text-white" />
          Excluir
        </button>
      </div>
    </div>
  );
};

export default UserRow;