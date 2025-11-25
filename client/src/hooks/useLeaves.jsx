import { useEffect, useState } from "react";
import axios from "axios";

const useLeaves = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          "https://senai-id-1.onrender.com/api/leaves"
        );
        setLeaves(res.data.data || []);
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
