import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  // Page the user was on before opening register (string or location object)
  const rawFrom = location.state?.from;
  let from =
    typeof rawFrom === "string"
      ? rawFrom
      : rawFrom?.pathname
      ? rawFrom.pathname + (rawFrom.search || "")
      : "/";
  if (from === "/login" || from === "/register") from = "/";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (!agree) {
      return setError("Please agree to the terms.");
    }

    try {
      setLoading(true);
        await register({
        fullName: form.name,
        email: form.email,
        password: form.password,
      }); 
      // New accounts are logged in automatically, so go back to where they were
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b3a55]">
        Join Rouge Edit
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
          disabled={loading}
          className="w-full rounded-full bg-[#8b3a55] py-3.5 text-sm font-medium text-white transition hover:bg-[#742f46] disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account →"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          state={{ from }}
          className="text-[#8b3a55] underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}