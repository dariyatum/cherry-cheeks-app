import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { register } from "../auth";

function InputField({ label, name, type = "text", placeholder, value, onChange }) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-700"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#8b3a55]"
      />
    </div>
  );
}

export default function RegisterForm() {
  const location = useLocation();

  // Page the user was on before opening register
  const rawFrom = location.state?.from;
  let from = "/";
  if (typeof rawFrom === "string") {
    from = rawFrom;
  } else if (rawFrom?.pathname) {
    from = rawFrom.pathname + (rawFrom.search || "");
  }
  if (["/login", "/register", "/unauthorized"].includes(from)) from = "/";
  if (from.startsWith("/admin") || from.startsWith("/cashier")) from = "/";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (form.name.trim() === "") {
      setError("Please enter your name.");
    } else if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
    } else if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
    } else if (!agree) {
      setError("Please agree to the terms.");
    } else {
      try {
        register(form.name, form.email, form.password);
        window.location.assign(from); // logged in, back to where they were
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b3a55]">
        Join Cherry Cheeks
      </p>

      <h1 className="mt-2 font-[Cormorant_Garamond] text-4xl font-semibold text-gray-900">
        Create account
      </h1>

      <p className="mb-6 mt-3 text-sm text-gray-500">
        Sign up to shop makeup, track your orders, and save your favorites.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <InputField
          label="Full name"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
        />
        <InputField
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={handleChange}
        />
        <InputField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <label className="mb-6 flex items-center gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="h-4 w-4 accent-[#8b3a55]"
          />
          I agree to the terms and privacy policy
        </label>

        <button
          type="submit"
          className="w-full rounded-full bg-[#8b3a55] py-3.5 text-sm font-medium text-white transition hover:bg-[#742f46]"
        >
          Create account →
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-500">
        Already have an account?{" "}
        <Link to="/login" state={{ from }} className="text-[#8b3a55] underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}