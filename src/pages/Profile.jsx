import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

// ---------- Sample data (replace with real data later) ----------
const profile = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+1 (555) 000-0000",
  address: {
    line1: "1234 Cherry Lane, Apt 4B",
    line2: "New York, New York 10001",
  },
};

const sampleProduct = {
  badge: "Bestseller",
  category: "Skincare · Essence",
  name: "Dew Petal Essence",
  price: 48,
  imageUrl: "/products/dew-petal-essence.jpg", // put an image in /public/products/
};

const recentOrders = [
  { id: 1, ...sampleProduct },
  { id: 2, ...sampleProduct },
];

const wishlist = [
  { id: 3, ...sampleProduct },
  { id: 4, ...sampleProduct },
];

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

function MiniProductCard({ product }) {
  return (
    <article className="w-full">
      <div className="relative aspect-square overflow-hidden rounded-[28px] bg-[#e8d9c5]">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
        {product.badge && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cherry">
            {product.badge}
          </span>
        )}
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-widest text-gray-400">
        {product.category}
      </p>
      <h3 className="mt-1 font-serif text-xl text-gray-900">{product.name}</h3>
      <p className="mt-1 text-sm font-semibold text-gray-900">${product.price}</p>
    </article>
  );
}

// ---------- Page ----------
export default function Profile() {
  const [active, setActive] = useState("Profile Overview");
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: call logout() from AuthContext here when auth is back
    navigate("/");
  };

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
            <h2 className="font-serif text-3xl text-gray-900">{profile.name}</h2>
            <p className="mt-1 text-gray-500">{profile.email}</p>
            <p className="text-sm text-gray-500">{profile.phone}</p>
          </div>
        </section>

        {/* Contact information */}
        <section>
          <SectionHeader title="Contact Information" />
          <div className="space-y-3">
            <InfoBox>{profile.email}</InfoBox>
            <InfoBox>{profile.phone}</InfoBox>
          </div>
        </section>

        {/* Shipping address */}
        <section>
          <SectionHeader title="Saved Shipping Address" />
          <div className="rounded-xl border border-[#eadfd3] bg-white p-6">
            <p className="text-sm font-semibold text-cherry">Default Address</p>
            <p className="mt-3 text-[15px] text-gray-800">{profile.address.line1}</p>
            <p className="mt-2 text-[15px] text-gray-800">{profile.address.line2}</p>
          </div>
        </section>

        {/* Recent orders */}
        <section>
          <SectionHeader title="Recent Orders" viewAllTo="/orders" />
          <div className="grid gap-6 sm:grid-cols-2 xl:max-w-[644px]">
            {recentOrders.map((p) => (
              <MiniProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Wishlist */}
        <section>
          <SectionHeader title="Wishlist" viewAllTo="/wishlist" />
          <div className="grid gap-6 sm:grid-cols-2 xl:max-w-[644px]">
            {wishlist.map((p) => (
              <MiniProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Account actions */}
        <section>
          <SectionHeader title="Account Actions" />
          <div className="flex flex-wrap gap-4">
            <button className="rounded-lg bg-cherry px-8 py-4 text-[15px] font-semibold text-white transition hover:opacity-90">
              Edit Profile
            </button>
            <button className="rounded-lg border border-[#eadfd3] bg-white px-8 py-4 text-[15px] font-semibold text-gray-900 transition hover:bg-gray-50">
              Change Password
            </button>
            <button className="rounded-lg border border-[#eadfd3] bg-white px-8 py-4 text-[15px] font-semibold text-gray-900 transition hover:bg-gray-50">
              Account Settings
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}