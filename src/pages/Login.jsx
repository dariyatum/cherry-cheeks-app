import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ArrowLeft } from "lucide-react";
import LoginCard from "../components/LoginCard";



function Login() {
  const location = useLocation();
const from = location.state?.from || "/";
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="flex flex-col bg-[#fcfaf6] px-6 py-8 sm:px-12 lg:px-[110px]">
        {/* Top bar */}
        <div className="flex items-center justify-between text-xs">
          <Link to={from} className="flex text-sm" aria-label="Go back">
          <ArrowLeft size={24} />
        </Link>
          <span className="font-sans uppercase tracking-widest text-gray-500">
            Join us
          </span>
          <Link
            to="/"
            className="flex items-center gap-1 font-sans text-cherry hover:underline"
          >
            <ArrowUpRight size={14} />
            View store
          </Link>
        </div>

        {/* Card */}
        
        <LoginCard />

        {/* Footer */}
        <p className="font-sans text-[11px] text-gray-400">
          © 2026 Cherry Cheeks
        </p>
      </div>

      {/* RIGHT SIDE (image) */}
      <div className="relative hidden bg-gradient-to-br from-cherry to-black lg:block">
        {/* To use a photo, add: <img src="/your-image.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" /> */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <h2 className="absolute left-14 top-14 text-3xl font-medium uppercase tracking-wide text-white">
          Cherry Cheeks
        </h2>

        <div className="absolute bottom-16 left-14 right-14 text-white">
          <p className="text-5xl font-medium leading-tight">
            “Your color story starts here.”
          </p>
          <p className="mt-4 font-sans text-xs uppercase tracking-[0.2em] text-white/80">
            Create your account in a minute
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;