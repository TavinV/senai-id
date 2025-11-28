import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext.jsx";
import LoadingScreen from "../ui/loadingScreen.jsx";

const PrivateRoute = ({ element, children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useAuthContext();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.cargo?.toLowerCase();

  // Se a rota requer papel específico e o usuário não tem:
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/carteirinha" replace />;
  }

  return element || children;
};

export default PrivateRoute;
