import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowRightLeft,
  Users,
  Headset,
  Mail,
  LogOut,
  LayoutGrid,
} from "lucide-react";

export default function SideMenuSecretaryAcess({ isOpen, onClose, user, onLogout }) {
  const menuRef = useRef(null);

  // Fecha o menu ao clicar fora ou pressionar ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        isOpen ? "visible bg-black/50" : "invisible bg-transparent"
      }`}
    >
      {/* Área clicável fora do menu */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Menu lateral */}
      <aside
        ref={menuRef}
        className={`absolute top-0 left-0 h-full w-72 bg-white shadow-2xl flex flex-col justify-between font-[Montserrat] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Cabeçalho */}
        <div>
          <div className="flex items-center gap-3 p-5 border-b border-gray-200">
            <img
              src={user?.avatar || "https://i.pravatar.cc/100?img=5"}
              alt="Foto de perfil"
              className="w-12 h-12 rounded-full border border-gray-300"
            />
            <div>
              <h2 className="font-semibold text-gray-800 text-base">
                {user?.name || "Secretaria"}
              </h2>
              <p className="text-sm text-gray-500">{user?.role || "Administrador"}</p>
            </div>
          </div>

          {/* Opções administrativas */}
          <nav className="flex flex-col gap-1 p-4 text-gray-700">
            <NavItem to="/dashboard" icon={<LayoutGrid size={20} />} onClick={onClose}>
              Dashboard
            </NavItem>
            <NavItem to="/liberacoes" icon={<ArrowRightLeft size={20} />} onClick={onClose}>
              Liberações
            </NavItem>
            <NavItem to="/usuarios" icon={<Users size={20} />} onClick={onClose}>
              Usuários
            </NavItem>
            <NavItem to="/mensagens" icon={<Mail size={20} />} onClick={onClose}>
              Mensagens
            </NavItem>
            <NavItem to="/suporte" icon={<Headset size={20} />} onClick={onClose}>
              Suporte
            </NavItem>
          </nav>
        </div>

        {/* Botão de sair */}
        <div className="p-5 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-semibold bg-[#d32f2f] hover:bg-[#b71c1c] transition"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>
    </div>
  );
}

function NavItem({ to, icon, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-lg transition ${
          isActive
            ? "bg-[#d32f2f]/10 text-[#d32f2f] font-semibold"
            : "hover:bg-gray-100"
        }`
      }
    >
      {icon} {children}
    </NavLink>
  );
}
