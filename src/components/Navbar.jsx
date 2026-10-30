import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, ShoppingBag, CircleUser, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const iconBtn =
  "rounded-full p-2 text-gray-900 transition-colors hover:bg-cherry/10 hover:text-cherry " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cherry";

function CherryLogo() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 fill-cherry" aria-hidden="true">
      <path d="M26 4c2 6 6 10 12 12-1 2-2 3-4 3-4-1-7-4-9-8z" />
      <path d="M24 12c-3 4-5 8-6 12l2 1c1-4 3-8 5-11z" />
      <circle cx="16" cy="33" r="11" />
      <circle cx="34" cy="31" r="9" />
    </svg>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation(); // used for the login redirect
  const { user } = useAuth();
  const { pathname } = location;
  const cartCount = 0;

  // Close menus when the page changes
  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Shadow / blur after scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes everything
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus the search input when it opens
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const desktopLink = ({ isActive }) =>
    `relative py-1 text-base tracking-wide transition-colors duration-200
     after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-cherry
     after:transition-all after:duration-300
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cherry rounded-sm
     ${
       isActive
         ? "text-cherry after:w-full"
         : "text-gray-700 hover:text-cherry after:w-0 hover:after:w-full"
     }`;

  const mobileLink = ({ isActive }) =>
    `block rounded-lg px-3 py-3 text-lg transition-colors
     ${
       isActive
         ? "bg-cherry/10 font-medium text-cherry"
         : "text-gray-700 hover:bg-gray-50 hover:text-cherry"
     }`;

  return (
    <header
      className={`sticky top-0 z-50 rounded-b-2xl transition-all duration-300 ${
        scrolled
          ? "bg-white/85 shadow-[0_10px_25px_rgba(139,58,82,0.18)] backdrop-blur-md"
          : "bg-white shadow-[0_10px_25px_rgba(139,58,82,0.08)]"
      }`}
    >
      <nav
        aria-label="Main"
        className={`mx-auto flex max-w-[90%] items-center justify-between px-5 transition-all duration-300 md:grid md:grid-cols-3 md:px-8 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        {/* Logo */}

           <Link
              to="/"
              className="mb-4 mt-5 inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cherry"
            >
              <img src="/logo1.png" alt="" className="h-15 w-auto" />
              <span className="text-xl font-medium uppercase tracking-wider text-gray-900 sm:text-2xl pt-4">
                Cherry Cheeks
              </span>
            </Link>

        {/* Desktop links (center) */}
        <ul className="hidden items-center justify-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink to={link.href} end={link.href === "/"} className={desktopLink}>
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Icons (right) */}
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <button
            aria-label="Search"
            aria-expanded={searchOpen}
            className={iconBtn}
            onClick={() => {
              setSearchOpen(!searchOpen);
              setOpen(false);
            }}
          >
            <Search size={28} strokeWidth={1.5} />
          </button>

          <Link
            to="/cart"
            aria-label={`Cart, ${cartCount} items`}
            className={`relative ${iconBtn}`}
          >
            <ShoppingBag size={28} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-cherry px-1 text-[11px] font-semibold leading-none text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account: profile if logged in, otherwise login (remembers this page) */}
          {user ? (
            <Link to="/profile" aria-label="Profile" className={iconBtn}>
              <CircleUser size={28} strokeWidth={1.5} />
            </Link>
          ) : (
            <Link
              to="/login"
              state={{ from: location.pathname + location.search }}
              aria-label="Log in"
              className={iconBtn}
            >
              <CircleUser size={28} strokeWidth={1.5} />
            </Link>
          )}

          {/* Hamburger (mobile only) */}
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={`md:hidden ${iconBtn}`}
            onClick={() => {
              setOpen(!open);
              setSearchOpen(false);
            }}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Search panel */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          searchOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q");
              console.log("search:", q); // TODO: navigate(`/products?q=${q}`)
              setSearchOpen(false);
            }}
            className="mx-auto flex max-w-3xl items-center gap-3 px-5 pb-4"
          >
            <input
              ref={searchRef}
              name="q"
              type="search"
              tabIndex={searchOpen ? 0 : -1}
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-base outline-none transition focus:border-cherry focus:bg-white focus:ring-2 focus:ring-cherry/30"
            />
            <button
              type="submit"
              tabIndex={searchOpen ? 0 : -1}
              className="rounded-full bg-cherry px-5 py-2.5 text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cherry focus-visible:ring-offset-2"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`grid transition-all duration-300 ease-in-out md:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <ul className="overflow-hidden px-5">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.href}
                end={link.href === "/"}
                tabIndex={open ? 0 : -1}
                className={mobileLink}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
          <li className="pb-3" />
        </ul>
      </div>
    </header>
  );
}

export default Navbar;