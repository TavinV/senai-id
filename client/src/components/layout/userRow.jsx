const UserRow = ({ user }) => {
  return (
    <div className="shadow bg-white flex justify-around gap-1 border-t-3 border-gray-300 p-7">
      <div className="flex-col relative">
        <img
          src={user.foto_perfil}
          alt={`${user.nome} foto`}
          className={`
            w-[4em] h-[4em] rounded-full object-cover absolute left-0 top-1/2 -translate-y-1/2
            ${user.cargo === "funcionario" ? "border-1 border-blue-800" : ""}
            ${user.cargo === "aluno" ? "border-1 border-red-600" : ""}
          `}
          style={{ zIndex: 0 }}
        />
        <div
          className="flex flex-col"
          style={{ paddingLeft: "calc(2em + 60px)", zIndex: 10 }}
        >
          <p className="font-semibold text-gray-900 mb-3 relative z-10">
            {user.nome}
          </p> 
          <p className="font-medium text-gray-600 relative z-10">
            {user.email || "—"}
          </p>
        </div>
      </div>
      {/*ID do usuário */}
      <div>
        <p className="font-semibold text-gray-900 mb-3 relative z-10">
          {user.matricula}
        </p>
        <p className="font-medium text-gray-600 relative z-10">
          {user.cargo === "funcionario" ? "NIF" : "Matricula"}
        </p>
      </div>
      {/*Cargo do usuário */}
      <div className="flex justify-center text-center">
        <div
          className={`p-2 rounded-2xl size-fit
        ${user.cargo === "aluno" ? "bg-red-200 text-red-600" : ""}
        ${user.cargo === "funcionario" ? "bg-blue-200 text-blue-800" : ""}
         `}
        >
          <p className="justify-center text-center font-bold">{user.cargo}</p>
        </div>
      </div>
      <div>
        <span>
          <strong>CPF:</strong> {user.cpf || "—"}
        </span>
      </div>
      <div>
        <span>
          <strong>Cargo:</strong> {user.cargo}
        </span>
      </div>
    </div>
  );
};

export default UserRow;
