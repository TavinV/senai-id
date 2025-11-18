import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// icons
import { User, GraduationCap } from 'lucide-react';

function SelectRole() {
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        
        // Navega para a página de registro baseado na seleção
        setTimeout(() => {
            if (role === 'aluno') {
                navigate('/registrar-aluno');
            } else if (role === 'funcionario') {
                navigate('/registrar-funcionario');
            }
        }, 500);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Botão Sou Funcionário */}
                <button
                    onClick={() => handleRoleSelect('funcionario')}
                    className={`p-6 border-2 rounded-lg transition-all duration-300 flex flex-col items-center justify-center gap-4 min-h-[200px] ${
                        selectedRole === 'funcionario' 
                            ? 'border-red-600 bg-red-50 shadow-lg transform scale-105' 
                            : 'border-gray-300 bg-white hover:border-red-400 hover:shadow-md'
                    }`}
                >
                    <div className={`p-4 rounded-full ${
                        selectedRole === 'funcionario' ? 'bg-red-600' : 'bg-gray-200'
                    }`}>
                        <User 
                            size={32} 
                            className={selectedRole === 'funcionario' ? 'text-white' : 'text-gray-600'}
                        />
                    </div>
                    <h3 className={`text-xl font-semibold ${
                        selectedRole === 'funcionario' ? 'text-red-600' : 'text-gray-800'
                    }`}>
                        Sou funcionário
                    </h3>
                    {selectedRole === 'funcionario' && (
                        <p className="text-sm text-gray-600 text-center mt-2">
                            Notificado, professor: 978-0-3-1-2
                        </p>
                    )}
                </button>

                {/* Botão Sou Aluno */}
                <button
                    onClick={() => handleRoleSelect('aluno')}
                    className={`p-6 border-2 rounded-lg transition-all duration-300 flex flex-col items-center justify-center gap-4 min-h-[200px] ${
                        selectedRole === 'aluno' 
                            ? 'border-red-600 bg-red-50 shadow-lg transform scale-105' 
                            : 'border-gray-300 bg-white hover:border-red-400 hover:shadow-md'
                    }`}
                >
                    <div className={`p-4 rounded-full ${
                        selectedRole === 'aluno' ? 'bg-red-600' : 'bg-gray-200'
                    }`}>
                        <GraduationCap 
                            size={32} 
                            className={selectedRole === 'aluno' ? 'text-white' : 'text-gray-600'}
                        />
                    </div>
                    <h3 className={`text-xl font-semibold ${
                        selectedRole === 'aluno' ? 'text-red-600' : 'text-gray-800'
                    }`}>
                        Sou aluno
                    </h3>
                    {selectedRole === 'aluno' && (
                        <p className="text-sm text-gray-600 text-center mt-2">
                            Expedindo: 02/4/16
                        </p>
                    )}
                </button>
            </div>

            {/* Mensagem de instrução */}
            <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                    Clique em uma das opções acima para continuar com seu primeiro acesso
                </p>
            </div>

            {/* Indicador de loading quando uma opção é selecionada */}
            {selectedRole && (
                <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 text-red-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        <span>Redirecionando...</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SelectRole;