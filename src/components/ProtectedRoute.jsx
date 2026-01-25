import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function ProtectedRoute({ children, role }) {
    const { user } = useAuth(); // adjust based on your AuthContext

    //Not logged in
    if (!user) {
        toast.warning("Please login to access this page", { duration: 3000 });
        return <Navigate to="/login" replace />;
    }

    //Role-based protection (optional)
    if (role && user.role !== role) {
        toast.warning("You do not have permission to access this page", { duration: 3000 });
        return <Navigate to="/" replace />;
    }

    //Allowed
    return children;
}
