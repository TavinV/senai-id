import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//Components
import FormManagement from "../components/containers/formManagement.jsx";
import LoggedHeader from "../components/layout/loggedHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import Footer from "../components/layout/footer.jsx";
import UseUsers from "../hooks/useUsers.jsx";
import UserRow from "../components/layout/userRow.jsx"
import LoadingScreen from "../components/ui/loadingScreen.jsx";

//icons
import { HiUsers } from "react-icons/hi";
import { MdEdit, MdDelete } from "react-icons/md"

function AccountsControl() {
    const { loading, users, error } = UseUsers();
    const navigate = useNavigate();

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
            {users.map((user) => (
              <UserRow
                key={user._id}
                type="accounts"
                user={user}
                labels={{
                  action1: "Editar",
                  action2: "Excluir",
                  icon1: <MdEdit />,
                  icon2: <MdDelete />,
                }}
                onAction1={() => {console.log(`Editando usuário: ${user._id}`),
                navigate(`/contas/editar/${user._id}`);
              }}
                onAction2={() => console.log("Excluir", user)}
              />
            ))}
          </div>
        </FormManagement>
      </MainContent>
      <Footer />
    </>
  );
}
export default AccountsControl;
