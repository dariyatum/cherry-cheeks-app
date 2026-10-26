import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AccountButton() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Not logged in: icon links to login and remembers the current page
  if (!user) {
    return (
      <Link
        to="/login"
        state={{ from: location.pathname + location.search + location.hash }}
        aria-label="Sign in"
      >
        <User size={22} />
      </Link>
    );
  }

  // Logged in: avatar with dropdown
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-cherry font-medium uppercase text-white"
        aria-label="Open profile menu"
      >
        {user.name?.[0] ?? "U"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white p-2 shadow-lg">
          <p className="truncate px-3 py-2 text-sm text-gray-500">{user.email}</p>
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block rounded px-3 py-2 text-sm hover:bg-gray-100"
          >
            My profile
          </Link>
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}