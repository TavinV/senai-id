//import { useEffect } from 'react'
//import { Clicpboard-list, X } from 'lucide-react';

//Status colors
/*const statusColors = {
    validado: 'bg-green-200 text-green-800',
    pendente: 'bg-yellow-200 text-yellow-800',
    expirado: 'bg-red-200 text-red-800',
}*/

const userRow = (
    nome, email, id, matricula, status, rg, foto
) => {

    return (
        <>
            <div className="flex items-center justify-between p-4 border-gray-400">
                {/* Usuário */}
                <div className="flex items-center gap-3 w-[25%]">
                    <img src={foto} alt="" />

                </div>

            </div>
            
        </>
    );
}

export default userRow;