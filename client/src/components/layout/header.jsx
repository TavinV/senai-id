import logo from "../../assets/senai.png";
import { NavLink } from "react-router-dom";
const Header = () => {
    return (
      <>
        <nav className="top-0 w-full flex justify-between items-center py-2 px-5 text-white bg-red-500">
          <NavLink to="/suporte">
            <p className="font-semibold text-0.7xl">Suporte</p>
          </NavLink>
        </nav>
        <header className="w-full flex justify-c text-black py-2 px-10 md:px-10 bg-white drop-shadow-md">
          <NavLink to="/">
            <img className="h-10" src={logo} alt="/" />
          </NavLink>
        </header>
      </>
    );
}

export default Header;