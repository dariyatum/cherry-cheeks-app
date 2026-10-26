import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ArrowLeft } from "lucide-react";

const inputClass =
  "mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-cherry focus:ring-2 focus:ring-cherry/20";
const labelClass =
  "text-xs font-medium uppercase tracking-wide text-gray-800";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.terms) {
      setError("Please accept the terms to continue.");
      return;
    }

    const { confirmPassword, terms, ...payload } = form;
    console.log(payload); // later: send to your backend
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="flex flex-col bg-[#fcfaf6] px-6 py-8 sm:px-12 lg:px-[110px]">
        {/* Top bar */}
        <div className="flex items-center justify-between text-xs">
          <Link to="/login" className="flex text-sm" aria-label="Back to login">
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
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[430px] rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-9">
            <h1 className="mt-2 text-5xl font-medium text-gray-900">REGISTER</h1>
            <p className="mt-3 font-sans text-sm text-gray-500">
              Create an account to save your orders and favorites.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5 font-sans">
              {/* Name */}
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className={inputClass}
                />
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="confirmPassword" className={labelClass}>
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className={inputClass}
                />
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 accent-cherry"
                />
                <span>
                  I agree to the{" "}
                  <Link to="/terms" className="text-cherry underline">
                    Terms &amp; Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Error */}
              {error && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600"
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-cherry py-4 text-sm font-medium text-white transition hover:opacity-90"
              >
                Create account
                <ArrowRight size={16} />
              </button>
            </form>

            <p className="mt-6 text-center font-sans text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-cherry underline">
                Login
              </Link>
            </p>
          </div>
        </div>

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

export default Register;