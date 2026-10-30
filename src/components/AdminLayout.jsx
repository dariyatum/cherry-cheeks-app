import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />

      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 border-b border-cherry/10 bg-white px-5 py-3 lg:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-full p-2 text-gray-900 hover:bg-cherry/10"
          >
            <Menu size={24} />
          </button>
          <span className="font-display text-lg text-gray-900">Admin</span>
        </header>

        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;