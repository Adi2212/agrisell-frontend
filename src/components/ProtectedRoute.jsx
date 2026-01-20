import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
    const { user } = useAuth(); // adjust based on your AuthContext

    //Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    //Role-based protection (optional)
    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    //Allowed
    return children;
}
