import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import FormManagement from "../components/containers/formManagement.jsx";
import LoggedHeader from "../components/layout/loggedHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import Footer from "../components/layout/footer.jsx";
import UseUsers from "../hooks/useUsers.jsx";
import UserRow from "../components/layout/userRow.jsx";
import LoadingScreen from "../components/ui/loadingScreen.jsx";
import Button from "../components/ui/button.jsx";

// Icons
import { HiUsers } from "react-icons/hi";
import { MdEdit, MdDelete } from "react-icons/md";

function AccountsControl() {
  const { loading, users, error, deleteUser } = UseUsers();
  const navigate = useNavigate();

  // Estado para o modal de confirmação
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filtra usuários - remove o perfil da secretaria (ou qualquer outro filtro que você precise)
  // Exemplo: removendo usuários com cargo "secretaria" ou email específico
  const filteredUsers = users.filter(user => {
    // Ajuste esta lógica conforme necessário para identificar o perfil da secretaria
    return user.cargo !== "secretaria" 
  });

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);
      const success = await deleteUser(userToDelete.id);

      if (success) {
        // Fechar modal e limpar estado
        setShowDeleteModal(false);
        setUserToDelete(null);
        // O hook useUsers já deve atualizar a lista automaticamente
      } else {
        alert("Erro ao excluir usuário. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      alert("Erro ao excluir usuário.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  if (loading) return <LoadingScreen />;
  if (error) return <p>Erro ao carregar usuários.</p>;

  return (
    <>
      <LoggedHeader />
      <MainContent>
        <FormManagement
          icon={HiUsers}
          title="Gerenciamento de contas"
          bgColor="bg-red-500"
        >
          <div>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Nenhum usuário encontrado.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <UserRow
                  key={user.id}
                  type="accounts"
                  user={user}
                  labels={{
                    action1: "Editar",
                    action2: "Excluir",
                    icon1: <MdEdit />,
                    icon2: <MdDelete />,
                  }}
                  onAction1={() => navigate(`/usuarios/editar/${user.id}`)}
                  onAction2={() => handleDeleteClick(user)}
                />
              ))
            )}
          </div>
        </FormManagement>
      </MainContent>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-[#0000004f] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirmar exclusão
              </h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir o usuário{" "}
                <span className="font-semibold">{userToDelete?.nome}</span>?
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  design="bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors"
                  onClick={handleCancelDelete}
                  disabled={deleting}
                >
                  Cancelar
                </Button>
                <Button
                  design="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                >
                  {deleting ? "Excluindo..." : "Excluir"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default AccountsControl;