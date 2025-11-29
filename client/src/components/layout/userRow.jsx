
// Icons
import { MdEdit, MdDelete } from "react-icons/md";
import Button from "../ui/button.jsx";

const UserRow = ({
  user,
  type, // "accounts" | "delays" | "leaves"
  labels = {},
  onAction1 = () => {},
  onAction2 = () => {},
}) => {
  const idValue = user.cargo === "funcionario" ? user.nif : user.matricula;
  const idLabel = user.cargo === "funcionario" ? "NIF" : "Matrícula";

  // Borda da imagem conforme cargo
  const imageBorder =
    user.cargo === "aluno  "
      ? "border-2 border-red-600"
      : user.cargo === "funcionario"
      ? "border-2 border-blue-800"
      : "border-2 border-gray-300";

  // Status geral para mudar o badge dependendo da tela
  const getStatusBadge = () => {
    if (type === "accounts") {
      return (
        <div
          className={`inline-flex px-3 py-1 rounded-full items-center
            ${user.cargo === "aluno" ? "bg-red-200 text-red-600" : ""}
            ${user.cargo === "funcionario" ? "bg-blue-200 text-blue-800" : ""}
            ${user.cargo === "secretaria" ? "bg-pink-200 text-pink-600" : ""}`}
        >
          <p className="font-bold text-sm capitalize">{user.cargo}</p>
        </div>
      );
    }

    if (type === "delays") {
      // status atraso
      const color =
        user.status === "pendente"
          ? "bg-yellow-200 text-yellow-700"
          : user.status === "validado"
          ? "bg-green-200 text-green-700"
          : "bg-red-200 text-red-700";

      return (
        <div className={`inline-flex px-5 py-1 rounded-full ${color}`}>
          <p className="font-bold text-sm capitalize">{user.status}</p>
        </div>
      );
    }

    if (type === "leaves") {
      const color =
        user.status === "permitida"
          ? "bg-green-200 text-green-700"
          : user.status === "a permitir"
          ? "bg-yellow-200 text-yellow-700"
          : "bg-red-200 text-red-700";

      return (
        <div className={`inline-flex px-3 py-1 rounded-full ${color}`}>
          <p className="font-bold text-md capitalize">{user.status}</p>
        </div>
      );
    }
  };

  // Botões de ação variam conforme o tipo
  return (
    <div className="shadow bg-white grid grid-cols-1 md:grid-cols-5 items-start md:items-center gap-3 md:gap-4 border-t border-gray-300 rounded-b-lg md:rounded-b-2xl p-4 md:p-6">
      {/* Usuário */}
      <div className="md:ml-4 flex items-center gap-3 md:gap-4">
        <img
          src={user.foto_perfil}
          alt={`${user.nome} foto`}
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shrink-0 ${imageBorder}`}
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 text-sm md:text-base truncate">{user.nome}</p>
          <p className="text-xs md:text-sm text-gray-500 truncate">{user.email || "—"}</p>
        </div>
      </div>

      {/* Identificação */}
      <div className="md:ml-6 flex items-start md:items-center justify-between md:block">
        <span className="md:hidden text-xs text-gray-500 font-medium">{idLabel}</span>
        <p className="font-semibold text-gray-900 text-sm md:text-base">{idValue || "—"}</p>
        <p className="hidden md:block text-sm text-gray-500">{idLabel}</p>
      </div>

      {/* Status */}
      <div className="flex items-start md:items-center justify-between md:justify-center">
        <span className="md:hidden text-xs text-gray-500 font-medium">Status</span>
        {getStatusBadge()}
      </div>

      {/* Documento */}
      <div className="flex items-start md:items-center justify-between md:block">
        <span className="md:hidden text-xs text-gray-500 font-medium">Documento</span>
        <p className="font-semibold text-gray-900 text-sm md:text-base">{user.cpf || "—"}</p>
        <p className="hidden md:block text-sm text-gray-500">Documento</p>
      </div>

      {/* Botões */}
      <div className="flex gap-2 md:gap-3 justify-end md:justify-end">
        <Button
          icon={labels.icon1}
          children={labels.action1}
          design="flex justify-center items-center py-2 md:py-3 px-2 md:px-2 text-black text-xs md:text-sm font-semibold gap-1 md:gap-2 bg-gray-100 rounded-md hover:bg-gray-200 hover:scale-105 transition-all whitespace-nowrap"
          onClick={onAction1}
        />

        <Button
          icon={labels.icon2}
          children={labels.action2}
          design="flex justify-center text-white items-center py-2 md:py-3 px-2 md:px-3 text-xs md:text-sm font-semibold gap-1 md:gap-2 bg-red-400 rounded-md hover:bg-red-500 hover:scale-105 transition-all whitespace-nowrap"
          onClick={onAction2}
        />
      </div>
    </div>
  );
};

export default UserRow;
