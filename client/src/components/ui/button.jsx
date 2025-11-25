const Button = ({
  icon = "text-2xl text-white",
  children,
  design = "flex py-2 text-white px-5 font-semibold gap-2 text-[1.05em] transition-all duration-300 rounded-xl items-center bg-red-500 hover:bg-red-600 hover:scale-105 focus:active:scale-95",
}) => {
    
  return (
    <button className={`${design}`}>
      {icon}
      {children}
    </button>
  );
};

export default Button;