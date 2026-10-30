  import { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { LogOut } from "lucide-react";
  import { useAuth } from "../../context/AuthContext";
  import LoginButton from "../../components/LoginButton";

  const menu = ["Profile Overview", "Order History", "Wishlist", "Settings"];

  // ---------- Small components ----------
  function SectionHeader({ title, viewAllTo }) {
    return (
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-serif text-2xl text-gray-900">{title}</h2>
        {viewAllTo && (
          <Link to={viewAllTo} className="text-sm font-semibold text-cherry hover:underline">
            View All
          </Link>
        )}
      </div>
    );
  }

  function InfoBox({ children }) {
    return (
      <div className="rounded-xl border border-[#eadfd3] bg-white px-5 py-4 text-[15px] text-gray-800">
        {children}
      </div>
    );
  }

  function EmptyState({ children }) {
    return (
      <div className="rounded-xl border border-dashed border-[#eadfd3] bg-white px-5 py-8 text-center text-sm text-gray-500">
        {children}
      </div>
    );
  }

  // ---------- Page ----------
  export default function Profile() {
    const [active, setActive] = useState("Profile Overview");
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Logged out: show a login prompt instead of crashing
    if (!user) {
      return (
        <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
          <h1 className="font-serif text-3xl text-gray-900">You're signed out</h1>
          <p className="mb-6 mt-3 text-gray-500">
            Log in to see your profile, orders and wishlist.
          </p>
          <LoginButton />
          <p className="mt-4 text-sm text-gray-500">
            New here?{" "}
            <Link to="/register" className="font-semibold text-cherry hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      );
    }

    // Real data from the logged-in account
    const name = user.fullName || user.name || "Customer";
    const email = user.email || "";
    const phone = user.phone || "";
    const address = user.address || null; // { line1, line2 } if you add it later
    const role = user.role || "CUSTOMER";

    // Fill these from your invoices / wishlist data later
    const recentOrders = [];
    const wishlist = [];

    const initials =
      name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U";

    const handleLogout = () => {
      logout();
      navigate("/", { replace: true });
    };

    return (
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-12 lg:grid-cols-[280px_1fr] lg:gap-20">
        {/* ---------- Sidebar ---------- */}
        <aside>
          <h1 className="border-b border-[#eadfd3] pb-4 font-serif text-2xl text-gray-900">
            Account
          </h1>
          <nav className="mt-10 flex flex-col gap-2" aria-label="Account">
            {menu.map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`rounded-lg px-4 py-3 text-left text-[15px] font-medium transition-colors ${
                  active === item
                    ? "bg-cherry text-white"
                    : "text-gray-500 hover:bg-cherry/10 hover:text-cherry"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-6 border-t border-[#eadfd3] pt-6">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-[15px] font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} />
              Log out
            </button>
          </div>
        </aside>

        {/* ---------- Main ---------- */}
        <main className="space-y-12">
          {/* Header */}
          <section className="flex items-center gap-6">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-cherry font-serif text-4xl text-white">
              {initials}
            </div>
            <div>
              <h2 className="font-serif text-3xl text-gray-900">{name}</h2>
              <p className="mt-1 text-gray-500">{email}</p>
              <span className="mt-2 inline-block rounded-full bg-cherry/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cherry">
                {role}
              </span>
            </div>
          </section>

          {active === "Profile Overview" && (
            <>
              <section>
                <SectionHeader title="Contact Information" />
                <div className="space-y-3">
                  <InfoBox>{email}</InfoBox>
                  <InfoBox>{phone || "No phone number added"}</InfoBox>
                </div>
              </section>

              <section>
                <SectionHeader title="Saved Shipping Address" />
                {address ? (
                  <div className="rounded-xl border border-[#eadfd3] bg-white p-6">
                    <p className="text-sm font-semibold text-cherry">Default Address</p>
                    <p className="mt-3 text-[15px] text-gray-800">{address.line1}</p>
                    {address.line2 && (
                      <p className="mt-2 text-[15px] text-gray-800">{address.line2}</p>
                    )}
                  </div>
                ) : (
                  <EmptyState>No shipping address saved yet.</EmptyState>
                )}
              </section>
            </>
          )}

          {active === "Order History" && (
            <section>
              <SectionHeader title="Recent Orders" viewAllTo="/orders" />
              {recentOrders.length ? null : (
                <EmptyState>You haven't placed any orders yet.</EmptyState>
              )}
            </section>
          )}

          {active === "Wishlist" && (
            <section>
              <SectionHeader title="Wishlist" viewAllTo="/wishlist" />
              {wishlist.length ? null : (
                <EmptyState>Your wishlist is empty.</EmptyState>
              )}
            </section>
          )}

          {active === "Settings" && (
            <section>
              <SectionHeader title="Account Actions" />
              <div className="flex flex-wrap gap-4">
                <button className="rounded-lg bg-cherry px-8 py-4 text-[15px] font-semibold text-white transition hover:opacity-90">
                  Edit Profile
                </button>
                <button className="rounded-lg border border-[#eadfd3] bg-white px-8 py-4 text-[15px] font-semibold text-gray-900 transition hover:bg-gray-50">
                  Change Password
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    );
  }