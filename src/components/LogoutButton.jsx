import { Link, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function LoginButton({ className = "" }) {
  const location = useLocation();

  return (
    <Link
      to="/login"
      state={{ from: location.pathname + location.search }}
      className={`inline-flex items-center gap-2 rounded-full bg-cherry px-6 py-3 text-[15px] font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cherry focus-visible:ring-offset-2 ${className}`}
    >
      <LogIn size={18} />
      Log in
    </Link>
  );
}