const UserRow = ({ user }) => {
  return (
    <div className="user-row border p-3 rounded-lg shadow bg-white flex flex-col gap-1">
        <div>
            <span><strong>Nome:</strong> {user.nome}</span>
        </div>
        <div>
            <span><strong>Email:</strong> {user.email || "—"}</span>
        </div>
        <div>
            <span><strong>CPF:</strong> {user.cpf || "—"}</span>
        </div>
        <div>
            <span><strong>Cargo:</strong> {user.cargo}</span>
        </div>
    </div>
  );
};

export default UserRow;
