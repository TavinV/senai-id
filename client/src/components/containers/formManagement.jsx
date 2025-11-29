import { 
    NavLink,
    Navigate 
} from "react-router-dom";

//Icons
import { Search } from "lucide-react";


const FormManagement = ({
    icon: Icon,
    title,
    bgColor = "bg-red-500",
    col1 = "Usuário",
    col2 = "ID",
    col3 = "Status",
    col4 = "Documento",
    col5 = "Ações", 
    children
}) => {

    return (
        <div className="flex flex-col w-full max-w-7xl h-auto min-h-96 shadow-2xl rounded-xl sm:rounded-2xl md:rounded-3xl bg-white">
             <div className={`flex flex-col sm:flex-row items-start sm:items-center w-full h-auto sm:h-18 ${bgColor} rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl pl-4 sm:pl-6 md:pl-7 pr-4 sm:pr-6 md:pr-7 py-4 sm:py-2 justify-between gap-4 sm:gap-2`}>              
                 {/*Título e ícone*/}
                 <div className="flex items-center shrink-0">
                     {Icon && <Icon size={28} className="sm:w-7 sm:h-7 md:w-9 md:h-9 text-white" />}
                     <p className="text-white p-2 sm:p-3 md:p-5 font-bold text-lg sm:text-xl md:text-2xl">{title}</p>
                 </div>
 
                 {/*Input para busca de alunos*/}
                 <div className="flex justify-start items-center gap-2 w-full sm:w-64 md:w-100 bg-red-400 h-10 rounded-md pl-3 shrink-0">
                     <Search className="text-white w-5 h-5" />
                     <input
                         type="text"
                         className="outline-none text-white placeholder:text-gray-100 focus:text-white w-full placeholder:font-semibold placeholder:text-xs sm:placeholder:text-sm bg-red-400"
                         placeholder="Pesquisar..."
                     />
                 </div>
             </div>
 
             {/*Cabeçalho das colunas*/}
             <div className="hidden md:block p-4 sm:p-6 md:p-8 w-full border-b border-gray-200">
                 <div className="grid grid-cols-5 gap-4 text-gray-800 font-bold text-sm md:text-base">
                     <p>{col1}</p>
                     <p>{col2}</p>
                     <p>{col3}</p>
                     <p>{col4}</p>
                     <p>{col5}</p>
                 </div>
             </div>
             <div className="flex-1 overflow-y-auto overflow-x-auto w-full" style={{ maxHeight: "600px" }}>
                {children}
            </div>
        </div>
     );
 }

export default FormManagement;