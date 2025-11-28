import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef, Children, cloneElement } from "react";

export default function MenuSelection({
  children,
  title,
  subTitle,
  icon: Icon,       // <-- ÍCONE VINDO POR PROPS
  ClassName = "flex justify-between items-center px-3 py-2 font-semibold text-black hover:text-red-600 hover:bg-gray-100 transition"
}) {
  const [openedMenu, setOpenedMenu] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (e) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setOpenedMenu(false);
      }
    };

    const handleKeyDown = () => setOpenedMenu(false);

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
        {/* Ícone passado via props — AQUI ESTÁ A MUDANÇA */}
        {Icon && <Icon size={18} />}

        <span>{title}</span>
      </button>

      {openedMenu && (
        <div
          role="menu"
          className="absolute top-full flex flex-col left-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg animate-fadeIn z-50"
        >
          <style>{`
            @keyframes fadeIn {
              0% { opacity: 0; transform: translateY(-6px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn { animation: fadeIn 160ms ease-out; }
          `}</style>

          <div className="font-bold bg-red-500 text-white text-center py-2 rounded-t-md">
            {subTitle}
          </div>

          <div className="flex flex-col">
            {Children.map(children, (child, idx) => {
              const ChildIcon = child.props.icon || Icon;

              return cloneElement(child, {
                className: ClassName,
                key: idx,
                role: "menuitem",
                icon: ChildIcon,
                onClick: (e) => {
                  if (child.props.onClick) child.props.onClick(e);
                  setOpenedMenu(false);
                },
                children: (
                  <>
                    {ChildIcon && <ChildIcon className="mr-2" size={18} />}
                    {child.props.children}
                  </>
                ),
              });
            })}
          </div>
        </div>
      )}
    </div>
  );
}
