import NavItem from "./navItem";
import logo from "../../assets/logo.png";
import MenuSelection from "../containers/menuSelection";
import { NavLink } from "react-router-dom";
import { useState } from "react";

//Icones
import { ArrowLeftToLine } from 'lucide-react';
import { ArrowRightLeft } from 'lucide-react';
import { Headset } from 'lucide-react';
import { Users } from 'lucide-react';
import { Mail } from 'lucide-react';
import { Menu, X } from 'lucide-react'; // Ícones para o menu mobile

import { useAuthContext } from "../../context/authContext";

const Header = () => {
    const { logout} = useAuthContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
      <>
        {/* Barra superior de sessão */}
        <nav className="top-0 w-full flex justify-start items-center py-2 px-5 text-white bg-red-500">
          <a className="flex gap-2 text-sm items-center font-semibold cursor-pointer" onClick={() => {logout()}}><ArrowLeftToLine /> Encerrar sessão</a>
        </nav>

        {/* Cabeçalho principal */}
        <header className="w-full flex items-center justify-between text-black py-2 px-4 md:px-8 bg-white drop-shadow-md">
          <NavLink to="/">
            <img className="h-12" src={logo} alt="/" />
          </NavLink>
          
          {/* Botão do menu hamburger (visível apenas em mobile) */}
          <button className="md:hidden text-black" onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Menu de navegação (visível em desktop e no mobile quando aberto) */}
          <div className={`
            absolute md:static top-16 left-0 w-full md:w-auto 
            bg-white md:bg-transparent shadow-md md:shadow-none 
            flex flex-col md:flex-row items-center md:justify-end gap-4 md:gap-8 py-4 md:py-0 z-10
            transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          `}>
            
            {/* Janela Pop-up de cadastro - Mantido como NavItem */}
            <NavItem>
              <MenuSelection /> 
            </NavItem>    
            
            <NavItem to="/liberações" icon={ArrowRightLeft}>Liberações</NavItem>
            <NavItem to="/usuarios" icon={Users}>Usúarios</NavItem>
            <NavItem to="/suporte" icon={Headset}>Suporte</NavItem>
            <NavItem to="/mensagens" icon={Mail}>Mensagens</NavItem>
          </div>

        </header>
      </>
    );
}

export default Header;
