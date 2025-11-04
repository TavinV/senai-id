import Header from "../components/layout/header.jsx";
import Footer from "../components/layout/footer.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import React from "react";
import SelectRole from "../components/containers/selectRole.jsx";

function FirstAccessSelectRole () {
    return(
    <>
     <Header />
     <SelectRole />
     <MainContent />
     <h1>Primeiro acesso</h1>
     <p>Iremos verificar se você tem uma conta cadastrada no sistema.</p>
     <SelectRole />
     <Footer />
  </>
  );
}

export default FirstAccessSelectRole;