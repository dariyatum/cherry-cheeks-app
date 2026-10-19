import { Link } from "react-router-dom";
import { useState } from "react";
import { Search, ShoppingBag, CircleUser, Menu, X } from "lucide-react";

const links = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function CherryLogo() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 fill-cherry">
      <path d="M26 4c2 6 6 10 12 12-1 2-2 3-4 3-4-1-7-4-9-8z" />
      <path d="M24 12c-3 4-5 8-6 12l2 1c1-4 3-8 5-11z" />
      <circle cx="16" cy="33" r="11" />
      <circle cx="34" cy="31" r="9" />
    </svg>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const cartCount = 2;

  return (
    <header className="sticky top-0 z-50 rounded-b-2xl bg-white shadow-[0_10px_25px_rgba(139,58,82,0.12)]">
      <nav className="mx-auto flex h-20 max-w-8xl items-center  justify-between px-5 md:grid md:grid-cols-3 md:px-25">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <CherryLogo />
          <span className="text-xl font-medium uppercase tracking-wider text-gray-900 sm:text-2xl">
            Cherry Cheeks
          </span>
        </a>

        {/* Desktop links (center) */}
        <ul className="hidden items-center justify-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="text-3xl text-gray transition-colors hover:text-cherry"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Icons (right) */}
        <div className="flex items-center justify-end  gap-6 text-gray-900">
          <button aria-label="Search" className="hover:text-cherry">
            <Search size={32} strokeWidth={1.5} />
          </button>

          <button aria-label="Cart" className="relative flex items-center gap-1 hover:text-cherry">
            <ShoppingBag size={30} strokeWidth={1.5} />
            <span className="text-xs font-semibold text-cherry">{cartCount}</span>
          </button>

          <Link to="/login" aria-label="Account" className="hover:text-cherry">
            <CircleUser size={33} strokeWidth={1.5} />
          </Link>

          {/* Hamburger (mobile only) */}
          <button
            aria-label="Toggle menu"
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
<div
  className={`grid transition-all duration-300 ease-in-out md:hidden ${
    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
  }`}>
  <ul className="overflow-hidden px-5">
    {links.map((link) => (
      <li key={link.name}>
        <a
          href={link.href}
          onClick={() => setOpen(false)}
          className="block rounded-lg px-3 py-3 text-xl text-gray-600 hover:bg-gray-50 hover:text-cherry"
        >
          {link.name}
        </a>
      </li>
    ))}
  </ul>
</div>
    </header>
  );
}

export default Navbar;