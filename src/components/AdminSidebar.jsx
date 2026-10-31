import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ReceiptText,
  Users,
  LogOut,
  X,
} from "lucide-react";
import { getUser, logout } from "../auth";
import avatar from "../assets/images/admin-avatar.jpg";

const items = [
  { name: "Overview", to: "/admin", icon: LayoutDashboard, end: true },
  { name: "Products", to: "/admin/products", icon: Package },
  { name: "Orders", to: "/admin/orders", icon: ReceiptText },
  { name: "Customers", to: "/admin/customers", icon: Users },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 font-display text-lg transition-colors
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
   ${
     isActive
       ? "bg-[#E9DED0] text-gray-900"
       : "text-white/90 hover:bg-white/10 hover:text-white"
   }`;

function AdminSidebar({ open, onClose }) {
  const user = getUser();

  const displayName = user?.fullName || "Admin";
  let role = "";
  if (user?.role) {
    role = user.role.charAt(0) + user.role.slice(1).toLowerCase();
  }

  const handleLogout = () => {
    logout(); // clears the saved login
    window.location.assign("/login"); // reload so the whole app sees it
  };

  return (
    <>
      {/* Dark background behind the menu on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Admin"
        className={`fixed inset-y-0 left-0 z-40 flex w-70 flex-col bg-cherry px-6 py-6 transition-transform duration-300
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Logo2.png" alt="" className="h-15 w-auto " />
            <span className="font-display text-ml pt-3 font-medium  tracking-[0.2em] text-white">
              Cherry Cheeks
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-1 text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav aria-label="Admin navigation" className="flex-1">
          <ul className="space-y-2">
            {items.map(({ name, to, icon: Icon, end }) => (
              <li key={name}>
                <NavLink to={to} end={end} className={linkClass} onClick={onClose}>
                  <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User and logout */}
        <div className="flex items-center gap-3 border-t border-white/15 pt-5">
          <img
            src={avatar}
            alt={displayName}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{displayName}</p>
            <p className="text-xs text-white/60">{role}</p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="rounded-full p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <LogOut size={20} strokeWidth={1.5} />
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;