import React from "react";
import Carteirinha from "../components/ui/carteirinha";
import { useAuthContext } from "../context/authContext";
import LoggedHeader from "../components/layout/loggedHeader";
import MainContent from "../components/layout/mainContent";

const CardAccess = () => {
  const { user } = useAuthContext();

  if (!user) {
    return <div>Carregando...</div>;
  }

  // Identifica se é aluno ou funcionário
  const isFuncionario = user.cargo && user.cargo.toLowerCase() !== "aluno";

  // Dados para carteirinha (layout igual para ambos)
  const propsCarteirinha = isFuncionario
    ? {
        photoPreview: user.foto_perfil_url,
        name: user.nome,
        cpf: user.cpf,
        role: user.cargo,
        pis: user.pis || "",
        nif: user.nif || "",
        course: user.departamento || "",
        type: "funcionario",
        matricula: user.matricula || "",
        dateOfBirth: user.data_nascimento || "",
      }
    : {
        photoPreview: user.foto_perfil_url,
        name: user.nome,
        cpf: user.cpf,
        role: user.cargo || "Aluno",
        pis: user.pis || "",
        nif: user.nif || "",
        course: user.curso,
        type: "aluno",
        matricula: user.matricula,
        dateOfBirth: user.data_nascimento,
      };

  return (
    <>
      <LoggedHeader />
      <MainContent>
      <div className="flex justify-center items-center px-2 py-8">
        <Carteirinha {...propsCarteirinha} />
      </div>
      </MainContent>
    </>
  );
};

export default CardAccess;
