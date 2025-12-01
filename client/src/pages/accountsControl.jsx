import { useState } from "react";
import { toast } from "react-toastify";

//Components
import FormManagement from "../components/containers/formManagement.jsx";
import LoggedHeader from "../components/layout/loggedHeader.jsx";
import MainContent from "../components/layout/mainContent.jsx";
import Footer from "../components/layout/footer.jsx";
import UseUsers from "../hooks/useUsers.jsx";
import UserRow from "../components/layout/userRow.jsx";
import LoadingScreen from "../components/ui/loadingScreen.jsx";

//icons
import { HiUsers } from "react-icons/hi";
import { MdEdit, MdDelete } from "react-icons/md";

function AccountsControl() {
    const { loading, users, error, updateUser, deleteUser, fetchUsers } = UseUsers();
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({});

    // ABRIR MODAL - Função mais simples possível
    const handleEditClick = (user) => {
        setSelectedUser(user);
        setFormData({
            nome: user.nome || "",
            email: user.email || "",
            cargo: user.cargo || "",
            curso: user.curso || "",
            turma: user.turma || "",
            matricula: user.matricula || "",
            cpf: user.cpf || "",
            data_nascimento: user.data_nascimento || "",
            descricao: user.descricao || "",
            nif: user.nif || "",
            pis: user.pis || "",
        });
        setShowModal(true);
    };

    // FECHAR MODAL
    const closeModal = () => {
        // CORREÇÃO: Usar setTimeout para garantir que o fechamento do modal ocorra
        // após o ciclo de vida do clique que o abriu.
        setTimeout(() => {
        setShowModal(false);
        setSelectedUser(null);
        }, 0);
    };

    // FUNÇÃO DE FORMATAÇÃO DE CPF
    const formatCPF = (value) => {
        // Remove tudo que não for dígito
        const cleanedValue = value.replace(/\D/g, '');
        
        // Aplica a máscara: XXX.XXX.XXX-XX
        let formattedValue = cleanedValue;
        if (cleanedValue.length > 3) {
            formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2');
        }
        if (cleanedValue.length > 6) {
            formattedValue = formattedValue.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        }
        if (cleanedValue.length > 9) {
            formattedValue = formattedValue.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        }
        
        // Limita a 14 caracteres (XXX.XXX.XXX-XX)
        return formattedValue.substring(0, 14);
    };

    // MANIPULAR INPUTS
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'cpf') {
            newValue = formatCPF(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    // ENVIAR FORMULÁRIO
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedUser) {
            toast.error("Usuário não encontrado");
            return;
        }

        try {
            // Preparar dados para enviar
            const dataToSend = {};
            
            // Adicionar apenas campos que foram alterados
            Object.keys(formData).forEach(key => {
                // Excluir o campo 'email' do envio, pois a API não permite sua alteração
                if (key === 'email') return; 

                if (formData[key] !== "" && formData[key] !== selectedUser[key]) {
                    dataToSend[key] = formData[key];
                }
            });

            // Enviar para API
            const res = await updateUser(selectedUser.id, dataToSend);
            
            if (res?.success) {
                toast.success("Usuário atualizado!");
                closeModal();
                fetchUsers(); // Atualizar lista
            } else {
                toast.error("Erro ao atualizar");
            }
        } catch (error) {
            toast.error("Erro ao atualizar usuário");
            console.error(error);
        }
    };

    // EXCLUIR USUÁRIO
    const handleDeleteClick = async (user) => {
        if (!window.confirm(`Excluir ${user.nome}?`)) return;
        
        const success = await deleteUser(user.id);
        if (success) {
            toast.success("Usuário excluído!");
        } else {
            toast.error("Erro ao excluir");
        }
    };

    if (loading) return <LoadingScreen />;
    if (error) return <p>Erro ao carregar usuários.</p>;

    return (
        <>
            <LoggedHeader />
            <MainContent>
                <FormManagement
                    icon={HiUsers}
                    title="Gerenciamento de contas"
                    bgColor="bg-red-500"
                >
                    <div>
                        {users.map((user) => (
                            <UserRow
                                key={user._id}
                                type="accounts"
                                user={user}
                                labels={{
                                    action1: "Editar",
                                    action2: "Excluir",
                                    icon1: <MdEdit />,
                                    icon2: <MdDelete />,
                                }}
                                onAction1={() => handleEditClick(user)}
                                onAction2={() => handleDeleteClick(user)}
                            />
                        ))}
                    </div>
                </FormManagement>
            </MainContent>
            <Footer />

            {/* MODAL SIMPLES - Controlado apenas por display block/none */}
            {showModal && selectedUser && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    // Usamos onMouseDown para evitar que o clique do botão de edição feche o modal imediatamente
                    onMouseDown={closeModal}
                >
                    <div 
                        className="bg-white rounded-lg p-5 w-11/12 max-w-lg max-h-[90vh] overflow-y-auto"
                        // Usamos onMouseDown para garantir que o clique dentro do modal não propague para o backdrop
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {/* Cabeçalho */}
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-bold text-gray-800">Editar Usuário</h2>
                            <button 
                                onClick={closeModal}
                                className="bg-none border-none text-2xl cursor-pointer text-gray-600 hover:text-gray-800"
                            >
                                ×
                            </button>
                        </div>

                        {/* Formulário */}
                        <form onSubmit={handleSubmit}>
                            {/* Nome */}
                            <div className="mb-4">
                                <label className="block mb-1 font-semibold text-gray-700">Nome *</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md text-base focus:ring-red-500 focus:border-red-500"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-4">
                                <label className="block mb-1 font-semibold text-gray-700">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    readOnly // Tornando o campo somente leitura
                                    className="w-full p-2 border border-gray-300 rounded-md text-base bg-gray-100 cursor-not-allowed" // Estilo para indicar que está desabilitado
                                    required
                                />
                            </div>

                            {/* Cargo */}
                            <div className="mb-4">
                                <label className="block mb-1 font-semibold text-gray-700">Cargo *</label>
                                <select
                                    name="cargo"
                                    value={formData.cargo || ''}
                                    disabled // Desabilitando o campo
                                    className="w-full p-2 border border-gray-300 rounded-md text-base bg-gray-100 cursor-not-allowed" // Estilo para indicar que está desabilitado
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    <option value="aluno">Aluno</option>
                                    <option value="funcionario">Funcionário</option>
                                    <option value="secretaria">Secretaria</option>
                                </select>
                            </div>

                            {/* CPF */}
                            <div className="mb-4">
                                <label className="block mb-1 font-semibold text-gray-700">CPF</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={formData.cpf || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md text-base focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            {/* Campos para Aluno */}
                            {formData.cargo === 'aluno' && (
                                <>
                                    <div className="mb-4">
                                        <label className="block mb-1 font-semibold text-gray-700">Curso</label>
                                        <input
                                            type="text"
                                            name="curso"
                                            value={formData.curso || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md text-base focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block mb-1 font-semibold text-gray-700">Turma</label>
                                        <input
                                            type="text"
                                            name="turma"
                                            value={formData.turma || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md text-base focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block mb-1 font-semibold text-gray-700">Matrícula</label>
                                        <input
                                            type="text"
                                            name="matricula"
                                            value={formData.matricula || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md text-base focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block mb-1 font-semibold text-gray-700">Data Nascimento</label>
                                        <input
                                            type="text"
                                            name="data_nascimento"
                                            value={formData.data_nascimento || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md text-base focus:ring-red-500 focus:border-red-500"
                                            placeholder="DD/MM/AAAA"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Campos para Funcionário */}
                            {formData.cargo === 'funcionario' && (
                                <>
                                    <div className="mb-4">
                                        <label className="block mb-1 font-semibold text-gray-700">Descrição</label>
                                        <textarea
                                            name="descricao"
                                            value={formData.descricao || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md text-base min-h-[80px] focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block mb-1 font-semibold text-gray-700">NIF</label>
                                        <input
                                            type="text"
                                            name="nif"
                                            value={formData.nif || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md text-base focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block mb-1 font-semibold text-gray-700">PIS</label>
                                        <input
                                            type="text"
                                            name="pis"
                                            value={formData.pis || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md text-base focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Botões */}
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-red-500 text-white border-none rounded-md text-base font-semibold cursor-pointer hover:bg-red-600 transition duration-150"
                                >
                                    Salvar
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 bg-gray-200 text-gray-700 border-none rounded-md text-base font-semibold cursor-pointer hover:bg-gray-300 transition duration-150"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default AccountsControl;
