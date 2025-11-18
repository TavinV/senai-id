import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

//Icones
import { ChevronRight } from "lucide-react";
import { UserPlus } from "lucide-react";

export default function Header() {
  const [openedMenu, setOpenedMenu] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Fecha ao clicar fora (pointerdown evita race com click do botão)
    const handlePointerDown = (e) => {
      // Se não houver wrapperRef ou target é null, não faz nada
      if (!wrapperRef.current) return;

      // Se o clique NÃO aconteceu dentro do wrapper, fecha
      if (!wrapperRef.current.contains(e.target)) {
        setOpenedMenu(false);
      }
    };

    // Fecha ao pressionar qualquer tecla
    const handleKeyDown = (e) => {
      // Se quiser só ESC: if (e.key === 'Escape') { ... }
      setOpenedMenu(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative inline-flex">
      {/* Botão que abre o menu */}
      <button
        onClick={() => setOpenedMenu((s) => !s)}
        className="flex items-center gap-2 font-semibold text-gray-700 hover:text-red-500 transition"
        aria-expanded={openedMenu}
        aria-haspopup="menu"
      >
        <UserPlus size={18} />
        <span>Cadastro</span>
      </button>

      {/* Dropdown */}
      {openedMenu && (
        <div
          role="menu"
          className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg animate-fadeIn z-50"
        >
          <style>{`
            @keyframes fadeIn {
              0% { opacity: 0; transform: translateY(-6px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn { animation: fadeIn 160ms ease-out; }
          `}</style>

          <div className="font-bold bg-red-500 text-white text-center py-2 rounded-t-md">
            Quem será registrado?
          </div>

          <NavLink
            to="/registrar-aluno"
            onClick={() => setOpenedMenu(false)}
            className="flex justify-between items-center px-3 py-2 font-semibold text-red-600 hover:bg-gray-100 transition"
            role="menuitem"
          >
            Aluno <ChevronRight size={18} />
          </NavLink>

          <NavLink
            to="/registrar-funcionario"
            onClick={() => setOpenedMenu(false)}
            className="flex justify-between items-center px-3 py-2 font-semibold text-blue-500 hover:bg-gray-100 transition"
            role="menuitem"
          >
            Funcionário <ChevronRight size={18} />
          </NavLink>
        </div>
      )}
    </div>
  );
}
