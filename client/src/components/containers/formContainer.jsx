export const FormContainer = ({ title, buttonText, loadingText, onSubmit, children, theme = "default", loading }) => {

  const mainColor = theme === "employee" ? "blue-800" : "red-600";
  const headerClasses = `bg-${mainColor} text-white text-2xl text-center py-3 font-semibold`
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // evita recarregar a página
        onSubmit?.();
      }}
      className="border border-gray-300 rounded-xl shadow-lg min-w-md overflow-hidden bg-white"
    >
      {/* Cabeçalho vermelho */}

      <div className={headerClasses}>

        {title}
      </div>

      {/* Conteúdo do formulário */}
      <div className="p-8 flex flex-col gap-10">
        {children}
      </div>

      {/* Botão de envio */}
      <div className="font-bold text-center p-8 rounded-md w-full flex justify-center">
        <button
          type="submit"
          className={`bg-${mainColor} text-white px-16 py-3 rounded w-full hover:scale-101 transition-transform duration-200  active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? loadingText : buttonText}
        </button>
      </div>
    </form>
  );
};