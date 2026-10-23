import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome, {user.name}!</p>
      <button
        onClick={handleLogout}
        className="mt-6 rounded-lg bg-[#8f3f56] px-5 py-2 text-white hover:bg-[#7a3448]"
      >
        Logout
      </button>
    </div>
  );
}