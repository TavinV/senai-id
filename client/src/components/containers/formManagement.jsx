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
        <div className="flex flex-col w-450 h-180 shadow-2xl rounded-3xl bg-white">
             <div className={`flex items-center w-450 h-18 ${bgColor} rounded-t-3xl pl-7 pr-7 justify-between`}>              
                 {/*Título e ícone*/}
                 <div className="flex items-center">
                     {Icon && <Icon size={38} className="text-white" />}
                     <p className="text-white p-5 font-bold text-2xl">{title}</p>
                 </div>
 
                 {/*Input para busca de alunos*/}
                 <div className="flex justify-start items-center gap-2 w-100 bg-red-400 h-10 rounded-md pl-3">
                     <Search className="text-white" />
                     <input
                         type="text"
                         className="outline-none text-white placeholder:text-gray-100 focus:text-white w-85 placeholder:font-semibold placeholder:text-[14px] bg-red-400"
                         placeholder="Pesquisar contas..."
                     />
                 </div>
             </div>
 
             {/*Conteúdo do Formulário*/}
             <div className="p-8 w-full">
                 <div className="flex justify-around text-gray-800 font-bold">
                     <p>{col1}</p>
                     <p>{col2}</p>
                     <p>{col3}</p>
                     <p>{col4}</p>
                     <p>{col5}</p>
                 </div>
             </div>
             <div className="flex-1 overflow-y-auto" style={{ maxHeight: "600px" }}>
                {children}
            </div>
        </div>
     );
 }

export default FormManagement;