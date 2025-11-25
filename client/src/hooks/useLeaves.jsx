import { useEffect, useState } from "react";
import api from "../services/api";

const useLeaves = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/early-exits");
        
        const data = res.data?.data;

        // ← Garantir que SEMPRE vira array
        if (Array.isArray(data)) {
          setLeaves(data);
        } else if (data && typeof data === "object") {
          setLeaves([data]); // ← caso a API retorne um único objeto
        } else {
          setLeaves([]);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Erro ao carregar saídas antecipadas");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { loading, error, leaves };
};

export default useLeaves;
