import { useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full h-[76px] min-h-[76px] border-b border-[#f3e3df] bg-[#faf7f2]">
      <div className="mx-auto flex h-full min-h-[76px] max-w-[1200px] shrink-0 items-center justify-between px-6">
        {/* Logo */}
        <a
          href="/"
          className="shrink-0 font-display text-3xl font-medium tracking-wide"
        >
          Cherry <span className="text-[#b76e79]">Cheeks</span>
        </a>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="text-3xl md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>

        {/* Navigation */}
        <nav
          className={`
            ${open ? "flex" : "hidden"}
            absolute left-0 right-0 top-[76px]
            flex-col border-b border-[#f3e3df]
            bg-[#faf7f2]
            md:static md:flex md:flex-row md:items-center
            md:gap-9 md:border-0 md:bg-transparent
          `}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-t border-[#f3e3df] px-6 py-4 transition-colors hover:text-[#b76e79] md:border-0 md:p-0"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
