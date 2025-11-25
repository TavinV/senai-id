import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

//Component
import Button from "../ui/button.jsx";

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
    <div className="shadow bg-white grid grid-cols-5 items-center gap-20 border-t rounded-b-2xl border-gray-300 p-6">
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
        <Button
          icon={<MdEdit className="mr-2 text-lg" />}
          children={"Editar"}
          design="flex py-2 text-black px-5 font-semibold gap-2 text-[1.05em] transition-all duration-300 rounded-xl items-center bg-gray-200 hover:bg-gray-300 hover:scale-105 focus:active:scale-95"
        />
        <Button
          icon={<MdDelete className="mr-2 text-lg" />}
          children={"Excluir"}
        />
      </div>
    </div>
  );
};

export default UserRow;
