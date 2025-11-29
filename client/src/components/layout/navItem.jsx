import { NavLink } from "react-router-dom";

const NavItem = ({to, icon: Icon, children}) => {
    return(
        <NavLink
        to={to}
        className="relative font-medium flex justify-center items-center gap-2 text-black cursor-pointer pb-1 text-sm md:text-base
        after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all
        after:duration-300 hover:after:w-full hover:text-red-500 transition-colors"         
        >
        {Icon && <Icon size={18} className="md:w-5 md:h-5" />}
        {children}
        </NavLink>
    );
}

export default NavItem;