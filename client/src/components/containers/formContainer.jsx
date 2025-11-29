export const FormContainer = ({ title, buttonText, loadingText, onSubmit, children, theme = "default", loading }) => {
  // Mapeamento explícito de classes Tailwind (evita que o purge remova as cores)
  const colorMap = {
    employee: {
      bg: "bg-blue-800",
      ring: "focus:ring-blue-300"
    },
    default: {
      bg: "bg-red-600",
      ring: "focus:ring-red-300"
    }
  };

  const { bg } = colorMap[theme] ?? colorMap.default;

  const headerClasses = `${bg} text-white text-2xl text-center py-3 font-semibold`;
  const buttonClasses = `${bg} text-white px-16 py-3 rounded w-full hover:scale-101 transition-transform duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="w-full sm:w-96 md:w-125 border border-gray-300 rounded-lg sm:rounded-xl shadow-lg overflow-hidden bg-white"
    >
      {/* Cabeçalho */}
      <div className={`${headerClasses} text-lg sm:text-xl md:text-2xl py-2 sm:py-3`}>
        {title}
      </div>

      {/* Conteúdo do formulário */}
      <div className="p-4 sm:p-6 md:p-7 flex flex-col gap-3 sm:gap-4 md:gap-5">
        {children}
      </div>

      {/* Botão de envio */}
      {
        buttonText && (
          <div className="font-bold text-center p-4 sm:p-6 md:p-8 rounded-md w-full flex justify-center">
          <button
            type="submit"
            className={buttonClasses}
            >
            {loading ? loadingText : buttonText}
          </button>
        </div>
        )
      }
    </form>
  );
};