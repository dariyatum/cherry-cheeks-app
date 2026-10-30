
import RegisterForm from "../../components/RegisterForm";
import { ArrowRight, ArrowUpRight, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Register() {
      const location = useLocation();
const from = location.state?.from || "/";
  return (
    <div className="grid min-h-screen font-[Inter] md:grid-cols-2">
      {/* LEFT: form side */}
      <div className="flex flex-col bg-[#fbf8f4] px-8 py-10 md:px-24">
        {/* Top bar */}
        <div className="flex items-center justify-between text-xs">
          <Link to={from} className="flex text-sm" aria-label="Go back">
            <ArrowLeft size={24} />
          </Link>

          <span className="uppercase tracking-widest text-gray-400">
            Secure Admin Portal
          </span>
          <a href="/" className="text-[#8b3a55]">
            ↗ View store
          </a>
        </div>

        {/* Form card in the middle */}
        <div className="flex flex-1 items-center justify-center py-10">
          <RegisterForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          © 2026 ROUGE EDIT · Founded by Kim MinJuu
        </p>
      </div>

      {/* RIGHT: image side (hidden on mobile) */}
      <div
        className="relative hidden bg-cover bg-center md:block"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        {/* Dark gradient so the white text is easy to read */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <h2 className="absolute left-14 top-12 font-[Cormorant_Garamond] text-3xl font-semibold tracking-wide text-gray-900">
          ROUGE EDIT
        </h2>

        <div className="absolute bottom-16 left-14 right-14 text-white">
          <p className="font-[Cormorant_Garamond] text-4xl leading-tight">
            “Color with intention, managed with clarity.”
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/80">
            Kim MinJuu · Founder
          </p>
        </div>
      </div>
    </div>
  );
}