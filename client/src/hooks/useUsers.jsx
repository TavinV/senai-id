import { useEffect, useState } from "react";
import axios from "axios";

//component
import UserRow from "../components/layout/userRow";

const UserList = () => {
  const [users, setUsers] = useState([]); // Armazenando os usuários no state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://senai-id-1.onrender.com/api/users"
        );

        const data = response.data.data;
        setUsers(Array.isArray(data) ? data : []);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError("Erro ao carregar usuários.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p>{error}</p>;
  if (users.length === 0) return <p>Nenhum usuário encontrado</p>;

  return (
    <>
      <div className="user-list">
        {users.map((user) => (
          <UserRow key={user._id} user={user} />
        ))}
      </div>
    </>
  );
};

export default UserList;
