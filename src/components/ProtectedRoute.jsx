import { Navigate, useLocation } from "react-router-dom";
import { getUser } from "../auth";

export default function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const user = getUser();

  // Not logged in → login, remembering the page they wanted
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // Logged in but wrong role (case-insensitive)
  if (roles && roles.length > 0) {
    const userRole = String(user.role || "").toUpperCase();
    const allowed = roles.map((r) => String(r).toUpperCase());

    if (!allowed.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}