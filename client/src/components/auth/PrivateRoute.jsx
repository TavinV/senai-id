// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext.jsx"
import LoadingScreen from "../ui/loadingScreen.jsx";

const PrivateRoute = ({element}) => {
    const { isAuthenticated, loading } = useAuthContext();
    
    if (loading) return <LoadingScreen />;

    return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
