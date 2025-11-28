import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext.jsx";
import LoadingScreen from "../ui/loadingScreen.jsx";

const PrivateRoute = ({ element, children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user, logout } = useAuthContext();
  if (loading) return <LoadingScreen />;
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  const userRole = user?.cargo?.toLowerCase();
  
  // Se a rota requer papel específico e o usuário não tem:
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    if(userRole === "secretaria") {
      return <Navigate to="/registrar-aluno" replace />;
    } else if (userRole === "aluno" || userRole === "funcionario") {
      return <Navigate to="/carteirinha" replace />;
    } else {
      logout();
      return <Navigate to="/login" replace />;
    }
  }

  return element || children;
};

export default PrivateRoute;
