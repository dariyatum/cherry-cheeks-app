import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  // 1. Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but wrong role → go to unauthorized page
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Allowed → show the page
  return children;
}
