import { NavLink } from "react-router-dom";
//Components
import FormManagement from "../components/containers/formManagement.jsx";
import LoggedHeader from "../components/layout/loggedHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import Footer from "../components/layout/footer.jsx";
import UseLeaves from "../hooks/useLeaves.jsx";
import UserRow from "../components/layout/userRow.jsx";

//icons
import { BiLogOut } from "react-icons/bi";
import { FaClipboardList } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

function LeavesControl() {
    const { loading, error, leaves } = UseLeaves([]);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    if (!leaves || !Array.isArray(leaves)) {
      return <p>Erro: resposta inesperada do servidor.</p>;
    }

    

  return (
    <>
      <LoggedHeader />
      <MainContent>
        <FormManagement
          icon={BiLogOut}
          title="Gerenciamento de Saídas"
          bgColor="bg-red-500"
        >
          {leaves.map((user) => (
            <UserRow
              key={user._id}
              type="leaves"
              user={user}
              labels={{
                action1: "Acessar saída",
                action2: "Fechar",
                icon1: <FaClipboardList />,
                icon2: <IoCloseSharp />,
              }}
              onAction1={() => console.log("Acessar saída", user)}
              onAction2={() => console.log("Fechar card", user)}
            />
          ))}
        </FormManagement>
      </MainContent>
      <Footer />
    </>
  );
}
export default LeavesControl;
