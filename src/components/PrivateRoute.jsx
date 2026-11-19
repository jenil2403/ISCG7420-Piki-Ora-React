import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function PrivateRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="page muted">Loading...</p>;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }
  if (!adminOnly && user.role === "admin" && window.location.pathname === "/") {
    return <Navigate to="/admin" />;
  }
  return children;
}

export default PrivateRoute;
