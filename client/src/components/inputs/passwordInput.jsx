import { Eye, EyeClosed, Lock } from "lucide-react";
import { useState } from "react";

export const PasswordInput = ({...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex gap-2 sm:gap-3 border-2 sm:border-3 border-gray-300 rounded-lg p-2 sm:p-2 items-center w-full">
      <Lock size={18} className="sm:w-5 sm:h-5 text-gray-600 shrink-0"/>

      {/* Campo de senha */}
      <input
        type={showPassword ? "text" : "password"}
        className="input flex-1 text-sm sm:text-base outline-none bg-transparent"
        {...props}
      />

      {/* Botão para mostrar/ocultar */}
      <button
        type="button"
        className="ml-1 sm:ml-2 text-gray-500 hover:text-gray-700 shrink-0"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <Eye className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5" />: <EyeClosed className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5" />}
      </button>
    </div>
  );
};
