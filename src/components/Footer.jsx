import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const socials = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    name: "TikTok",
    href: "#",
    icon: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />,
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </>
    ),
  },
];

const columns = [
  {
    title: "Explore",
    links: [
      { name: "Home", to: "/" },
      { name: "Products", to: "/products" },
      { name: "About", to: "/about" },
      { name: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Shop",
    links: [
      { name: "Skincare", to: "/products" },
      { name: "Makeup", to: "/products" },
      { name: "Sets", to: "/products" },
    ],
  },
  {
    title: "Info",
    links: [
      { name: "Our story", to: "/about" },
      { name: "Journal", to: "/journal" },
      { name: "Shipping", to: "/shipping" },
    ],
  },
];

const legal = [
  { name: "Privacy", to: "/privacy" },
  { name: "Terms", to: "/terms" },
  { name: "Accessibility", to: "/accessibility" },
];

const iconBtn =
  "flex h-10 w-10 items-center justify-center rounded-full border border-cherry/20 text-gray-700 transition-colors " +
  "hover:bg-cherry/10 hover:text-cherry " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cherry";

const footerLink =
  "relative inline-block rounded-sm py-1 text-base text-gray-700 transition-colors duration-200 " +
  "after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-cherry after:transition-all after:duration-300 " +
  "hover:text-cherry hover:after:w-full " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cherry";

const headingClass =
  "mb-4 text-sm font-medium uppercase tracking-wider text-gray-900";

function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="mt-5 rounded-t-2xl bg-white shadow-[0_-10px_25px_rgba(139,58,82,0.12)]">
      <div className="mx-auto max-w-[90%] px-5 pb-6 pt-14 md:px-8">
        {/* Newsletter */}
        <div className="flex flex-col gap-6 border-b border-cherry/10 pb-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl text-gray-900">Join the Cherry Cheeks list</h3>
            <p className="mt-1 text-gray-600">
              Skincare tips, new products, and special offers.
            </p>
          </div>

          {subscribed ? (
            <p className="font-medium text-cherry">Thank you for subscribing!</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
              className="flex w-full max-w-md gap-3"
            >
              <input
                type="email"
                required
                placeholder="Your email"
                aria-label="Email address"
                className="w-full rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-base outline-none transition focus:border-cherry focus:bg-white focus:ring-2 focus:ring-cherry/30"
              />
              <button
                type="submit"
                className="rounded-full bg-cherry px-5 py-2.5 text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cherry focus-visible:ring-offset-2"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 border-b border-cherry/10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.5fr]">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cherry"
            >
              <img src="/logo1.png" alt="" className="h-15 w-auto" />
              <span className="pt-4 text-xl font-medium uppercase tracking-wider text-gray-900 sm:text-2xl">
                Cherry Cheeks
              </span>
            </Link>

            <p className="mb-6 max-w-xs leading-relaxed text-gray-600">
              Quiet rituals, luminous skin. Makeup and skincare from Seoul.
            </p>

            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className={iconBtn}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className={headingClass}>{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.to} className={footerLink}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div>
            <h4 className={headingClass}>Contact</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 shrink-0 text-cherry" aria-hidden="true" />
                <span>168 PSE Street, Seoul, South Korea</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-cherry" aria-hidden="true" />
                <a
                  href="mailto:hello@cherrycheeks.com"
                  className="transition-colors hover:text-cherry"
                >
                  buntha@cherrycheeks.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-cherry" aria-hidden="true" />
                <a
                  href="tel:+82212345678"
                  className="transition-colors hover:text-cherry"
                >
                  +855 12 345 678
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="mt-1 shrink-0 text-cherry" aria-hidden="true" />
                <span>Mon to Fri, 9:00 to 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start gap-4 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Cherry Cheeks. Owned by Kim MinJuu.</p>
          <ul className="flex gap-6">
            {legal.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.to}
                  className="rounded-sm transition-colors hover:text-cherry focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cherry"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;