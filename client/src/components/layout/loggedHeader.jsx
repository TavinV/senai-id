import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import MenuSelection from "../containers/menuSelection.jsx";
import NavItem from "./navItem.jsx";
import SideMenu from "./sideMenuSecretaryAcess.jsx";

// Ícones
import {
  ArrowLeftToLine,
  ArrowRightLeft,
  Headset,
  Users,
  Mail,
  Menu,
} from "lucide-react";

import { useAuthContext } from "../../context/authContext.jsx";

const Header = () => {
  const { logout } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Dados fictícios do usuário — podem vir do contexto de autenticação
  const user = {
    name: "Otávio Vinícius",
    role: "Conta Técnica",
    avatar: "https://i.pravatar.cc/100?img=3",
  };

  return (
    <>
      {/* Barra superior */}
      <nav className="top-0 w-full flex justify-start items-center py-2 px-5 text-white bg-red-500 font-[Montserrat]">
        <a
          className="flex gap-2 text-sm items-center font-semibold cursor-pointer"
          onClick={() => logout()}
        >
          <ArrowLeftToLine /> Encerrar sessão
        </a>
      </nav>

      {/* Cabeçalho principal */}
      <header className="w-full flex items-center justify-between text-black py-2 px-4 md:px-10 bg-white drop-shadow-md font-[Montserrat]">
        {/* Logo */}
        <NavLink to="/">
          <img className="h-12" src={logo} alt="SENAI" />
        </NavLink>

        {/* Botão do menu mobile */}
        <button
          className="md:hidden text-black p-2 rounded hover:bg-gray-100 transition"
          onClick={toggleMenu}
        >
          <Menu size={28} color="black" />
        </button>

        {/* Menu desktop */}
        <div
          className="
            hidden md:flex md:flex-row md:items-center md:justify-around w-full text-black
          "
        >
          <NavItem>
            <MenuSelection />
          </NavItem>
          <NavItem to="/liberacoes" icon={ArrowRightLeft}>
            Liberações
          </NavItem>
          <NavItem to="/usuarios" icon={Users}>
            Usuários
          </NavItem>
          <NavItem to="/suporte" icon={Headset}>
            Suporte
          </NavItem>
          <NavItem to="/mensagens" icon={Mail}>
            Mensagens
          </NavItem>
        </div>
      </header>

      {/* Side Menu Mobile */}
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onLogout={logout}
      />
    </>
  );
};

export default Header;
