import React from "react";

const Button = ({
  icon = null,
  children,
  design = "inline-flex items-center gap-2 py-2 text-white px-5 font-semibold text-[1.05em] transition-all duration-300 rounded-xl bg-red-500 hover:bg-red-600 hover:scale-105 focus:active:scale-95",
  type = "button",
  ...rest
}) => {
  const renderIcon = () => {
    if (!icon) return null;
    // Se for um elemento React (ex: react-icons), clona e adiciona classe de tamanho
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        className: `${
          icon.props?.className ? icon.props.className + " " : ""
        }text-2xl`,
        "aria-hidden": true,
      });
    }
    // Se for uma string de classes, renderiza um elemento <i>
    return <i className={icon} aria-hidden />;
  };

  return (
    <button type={type} {...rest} className={`${design} ${rest.className || ""}`}>
      <span className="flex items-center gap-2 whitespace-nowrap">
        {renderIcon()}
        <span>{children}</span>
      </span>
    </button>
  );
};

export default Button;
