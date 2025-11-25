import { useEffect, useState } from "react";
import api from "../services/api";

const useLateUsers = () => {
  const [loading, setLoading] = useState(true);
  const [lateUsers, setLateUsers] = useState([]); // ← garante array
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/late-entries");

        const data = res.data?.data;

        // ← Garantir que SEMPRE vira array
        if (Array.isArray(data)) {
          setLateUsers(data);
        } else if (data && typeof data === "object") {
          setLateUsers([data]); // ← caso a API retorne um único objeto
        } else {
          setLateUsers([]);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Erro ao carregar usuários com atraso.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { loading, error, lateUsers };
};

export default useLateUsers;
