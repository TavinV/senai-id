import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import SideMenuUserAcess from "./sideMenuUserAcess.jsx";

// Ícones
import { Bell, Menu, LogOut } from "lucide-react";

import { useAuthContext } from "../../context/authContext.jsx";

const UserHeader = () => {
  const { logout, user } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Logo vai para página da carteirinha (usuário)
  const getLogoDest = () => "/carteirinha";

  const userInfo = {
    name: user?.nome || "Usuário",
    role: user?.cargo?.charAt(0).toUpperCase() + user?.cargo?.slice(1) || "Cargo",
    avatar: user?.foto_perfil || "https://i.pravatar.cc/100?img=3",
  };

  return (
    <>
      {/* Barra superior */}
      <nav className="top-0 w-full flex justify-between items-center py-2 px-3 sm:px-5 text-white bg-red-500 font-[Montserrat]"></nav>

      {/* Cabeçalho principal */}
      <header className="w-full flex flex-row-reverse items-center justify-between text-black py-2 px-10 sm:px-6 md:px-15 bg-white drop-shadow-md font-[Montserrat]">
        {/* Logo */}
        <NavLink
          to={getLogoDest()}
          className="shrink-0 w-full flex justify-center md:justify-center items-center"
        >
          <img className="h-15 sm:h-15" src={logo} alt="SENAI" />
        </NavLink>

        {/* Botão do menu mobile */}
        <button
          className=" text-black p-1 sm:p-2 rounded hover:bg-gray-100 transition"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <Menu size={24} className="sm:w-7 sm:h-7" color="black" />
        </button>
      </header>

      {/* Side Menu Mobile */}
      <SideMenuUserAcess
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={userInfo}
        onLogout={logout}
      />
    </>
  );
};

export default UserHeader;
