import Header from "../components/layout/header.jsx";
import Footer from "../components/layout/footer.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import SelectRole from "../components/containers/selectRole.jsx";

function FirstAccessSelectRole() {
    return(
        <>
            <Header />
            <MainContent>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-4xl mx-auto px-4">
                        {/* Cabeçalho informativo */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">Primeiro acesso</h1>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Iremos verificar se você tem uma conta cadastrada no sistema.
                            </p>
                        </div>
                        
                        {/* Componente de seleção de cargo */}
                        <SelectRole />
                    </div>
                </div>
            </MainContent>
            <Footer />
        </>
    );
}

export default FirstAccessSelectRole;