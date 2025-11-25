import Header from "../components/layout/header.jsx";
import Footer from "../components/layout/footer.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import SelectRole from "../components/containers/selectRole.jsx";
import { FormContainer } from "../components/containers/formContainer.jsx";

function FirstAccessSelectRole() {
  return (
    <>
      <Header />
      <MainContent className="p-4">
        <FormContainer>
        <div className="max-w-4xl mx-auto px-10">
            {/* Cabeçalho informativo */}
            <div className="text-center mb-5 ">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 p-10">
                Primeiro acesso
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Iremos verificar se você tem uma conta cadastrada no sistema.
              </p>
            </div>

            {/* Componente de seleção de cargo */}
            <SelectRole />
          </div>
        </FormContainer>

      </MainContent>
      <Footer />
    </>
  );
}

export default FirstAccessSelectRole;
