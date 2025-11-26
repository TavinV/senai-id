import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // 1. Verifica login
  if (!user) return <Navigate to="/login" />;

  // 2. Verifica cargo permitido
  if (!allowedRoles.includes(user.cargo)) {
    return <Navigate to="/support" />; // Ou qualquer página de acesso negado
  }

  return children;
}
