import { useEffect, useState } from "react";
import axios from "axios";

//Component
import UserRow from "../components/layout/userRow.jsx"

const DelayList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lateUsers, setLateUsers] = useState([]); 

    //Conexão com a API dos usuários com atraso
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    "https://senai-id-1.onrender.com/api/late-entries"
                );

                const data = response.data.data;
                setLateUsers(Array.isArray(data) ? data : []);
            } catch (error) {
                setError("Erro ao carregar usuários com atraso.", error);
            } finally {
                setLoading(false)
            }
        }

        fetchUsers();
    }, []);

    //Respostas da conexão
    if (loading) return <p>Carregando usuários...</p>;
    if (error) return <p>{error}</p>;
    if (lateUsers.length === 0) return <p>Nenhum usuário encontrado</p>;

    return (
      <div className="user-list">
        {lateUsers.map((user) => (
          <UserRow key={user._id} user={user} />
        ))}
      </div>
    );
}

export default DelayList;