import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

function PrivateRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="page muted">Loading...</p>;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }
  if (!adminOnly && user.role === "admin" && location.pathname === "/") {
    return <Navigate to="/admin" />;
  }
  return children;
}

export default PrivateRoute;
