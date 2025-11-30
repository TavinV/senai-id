import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuthContext } from "../../context/authContext.jsx";

/**
 * BackButton
 * - Mostra apenas em rotas protegidas (quando user está logado) e modais
 * - Oculta automaticamente em rotas públicas (ex.: '/', '/login', '/primeiro-acesso', '/suporte', '/confirmar-cpf')
 * - Oculta por padrão em mobile; use `forceShowOnMobile` para forçar (ex.: em modais)
 * - Não renderiza se não houver histórico navegável
 *
 * Props:
 * - className: classes extras
 * - forceShowOnMobile: boolean para forçar exibição em mobile (útil em modais)
 */
const BackButton = ({
  className = "",
  forceShowOnMobile = false,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuthContext();
  const [isMobile, setIsMobile] = useState(false);
  const [hasHistory, setHasHistory] = useState(true);

  // Rotas públicas onde o botão não deve aparecer
  const publicRoutes = ["/", "/login", "/primeiro-acesso", "/suporte", "/confirmar-cpf"];

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setHasHistory(window.history.length > 1);
    }, 0);
    return () => clearTimeout(t);
  }, [pathname]);

  // Oculta em rotas públicas
  if (publicRoutes.includes(pathname)) return null;

  // Oculta em mobile a menos que seja forçado (para modais)
  if (isMobile && !forceShowOnMobile) return null;

  // Se não houver histórico, não mostra
  if (!hasHistory) return null;

  // Oculta se o usuário não estiver autenticado (exceto em modais, onde forceShowOnMobile=true)
  if (!user && !forceShowOnMobile) return null;

  return (
    <button
      type="button"
      aria-label="Voltar"
      onClick={() => navigate(-1)}
      className={`flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition ${className}`}
    >
      <ArrowLeft size={20} />
    </button>
  );
};

export default BackButton;
