import { Routes, Route, Navigate } from "react-router-dom";
import LoginCard from "./pages/LoginCard";
import Unauthorized from "./pages/Unauthorized";
import UserDashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginCard />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["user", "admin"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}