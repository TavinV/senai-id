import { useEffect } from "react";
import { NavLink } from "react-router-dom";
//Components
import FormManagement from "../components/containers/formManagement.jsx";
import LoggedHeader from "../components/layout/loggedHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import Footer from "../components/layout/footer.jsx";
import useLateEntries from "../hooks/useLateEntries.jsx";
import UserRow from "../components/layout/userRow.jsx";
import LoadingScreen from "../components/ui/loadingScreen.jsx";

//icons
import { FaClipboardList } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { AlarmClock } from "lucide-react";

function DelayControl() {
  const {
    loading,
    error,
    lateEntries,
    getLateEntries
  } = useLateEntries();

  useEffect(() => {
    getLateEntries(); // Carrega atrasos do Admin
  }, []); // Executa só uma vez ao iniciar tela

  if (loading) return <LoadingScreen />;
  if (error) return <p>Erro ao carregar usuários.</p>;

  if (!lateEntries || !Array.isArray(lateEntries)) {
    console.error("Resposta inesperada do servidor:", lateEntries);
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
          {lateEntries.map((entry) => (
            <UserRow
              key={entry.codigo_atraso} // Ajustado conforme backend
              type="delays"
              user={entry}
              labels={{
                action1: "Acessar atraso",
                action2: "Fechar",
                icon1: <FaClipboardList />,
                icon2: <IoCloseSharp />,
              }}
              onAction1={() => console.log("Acessar atraso", entry)}
              onAction2={() => console.log("Fechar card", entry)}
            />
          ))}
        </FormManagement>
      </MainContent>
      <Footer />
    </>
  );
}

export default DelayControl;
