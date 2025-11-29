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
  UserPlus,
  LogOut,
  Headset,
  Users,
  Mail,
  Menu,
  AlarmClock,
  ChevronRight,
  User
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
            <MenuSelection
              title="Cadastro"
              subTitle="Quem será cadastrado?"
              icon={UserPlus}
            > 
              <NavLink
                children="Aluno"
                to="/registrar-aluno"
                icon={ChevronRight}
              />
              <NavLink
                children="Funcionário"
                to="/registrar-funcionario"
                icon={ChevronRight}
                className="flex justify-between items-center px-3 py-2 font-semibold text-black hover:text-blue-600 hover:bg-gray-100 transition"
                
              />
            </MenuSelection>
              

          </NavItem>
          <MenuSelection
            title="Gerenciamento"
            subTitle={"Qual seção irá  acessar?"}
            icon={Users}
          >
            <NavLink
                children="Contas"
                to="/contas"
                icon={Users}
              />
              <NavLink
                children="Atrasos"
                to="/atrasos"
                icon={AlarmClock}
              />
              <NavLink
                children="Saídas"
                to="/saidas"
                icon={LogOut}
              />
          </MenuSelection>
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
