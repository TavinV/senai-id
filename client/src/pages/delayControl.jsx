import { NavLink } from "react-router-dom";
//Components
import FormManagement from "../components/containers/formManagement.jsx";
import LoggedHeader from "../components/layout/loggedHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import Footer from "../components/layout/footer.jsx";
import UseDelay from "../hooks/useDelay.jsx";
import UserRow from "../components/layout/userRow.jsx";

//icons
import { FaClipboardList } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { AlarmClock } from "lucide-react";

function DelayControl() {
  const { loading, lateUsers, error } = UseDelay([]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar usuários.</p>;

  //Verifica se ele está tentanto buscar uma array
  if (!lateUsers || !Array.isArray(lateUsers)) {
    return <p>Erro: resposta inesperada do servidor.</p>;
  }

  return (
    <>
      <LoggedHeader />
      <MainContent>
        <FormManagement
          icon={AlarmClock}
          title="Gerenciamento de Atrasos"
          bgColor="bg-red-500"
        >
          {lateUsers.map((user) => (
            <UserRow
              key={user._id}
              type="delays"
              user={user}
              labels={{
                action1: "Acessar atraso",
                action2: "Fechar",
                icon1: <FaClipboardList />,
                icon2: <IoCloseSharp />,
              }}
              onAction1={() => console.log("Acessar atraso", user)}
              onAction2={() => console.log("Fechar card", user)}
            />
          ))}
        </FormManagement>
      </MainContent>
      <Footer />
    </>
  );
}
export default DelayControl;
