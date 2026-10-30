import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Page the user was on before opening login (string or location object)
  const rawFrom = location.state?.from;
  let from =
    typeof rawFrom === "string"
      ? rawFrom
      : rawFrom?.pathname
      ? rawFrom.pathname + (rawFrom.search || "")
      : "/";
  if (["/login", "/register", "/unauthorized"].includes(from)) from = "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const user = await login(email, password, remember); // wait for the result

      if (!user) {
        setError("Wrong email or password");
        return;
      }

      // Staff go to their area; customers never get sent to staff pages
      const routes = { ADMIN: "/admin", CASHIER: "/cashier" };
      const staffOnly = from.startsWith("/admin") || from.startsWith("/cashier");
      const target = routes[user.role] || (staffOnly ? "/" : from);

      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const input =
    "mt-2 mb-5 h-[50px] w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-[15px] focus:border-[#8f3f56] focus:outline-none";
  const label = "text-sm font-medium text-gray-700";
  const link = "text-sm font-medium text-cherry hover:underline";
  const social =
    "mb-3 h-[50px] rounded-xl border border-gray-200 bg-white text-[15px] text-gray-700 hover:bg-gray-50";

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[430px] flex-col rounded-[20px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] sm:rounded-[28px] sm:p-12"
      >
        <h1 className="mb-1 mt-2 text-center text-2xl font-bold text-[#141b2d] sm:text-3xl">
          Welcome Back To Cherry Cheek
        </h1>
        <p className="mb-8 text-center text-gray-500">
          Sign in to your account to continue
        </p>

        <label htmlFor="email" className={label}>
          Email address
        </label>
        <input
          id="email"
          className={input}
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex justify-between">
          <label htmlFor="password" className={label}>
            Password
          </label>
          <Link to="/forgot-password" className={link}>
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          className={input}
          type="password"
          placeholder="••••••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="mb-4 flex items-center justify-between">
          <label className="flex items-center gap-2.5 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 accent-[#8f3f56]"
            />
            Remember me
          </label>
          <Link to="/help" className={link}>
            Need help?
          </Link>
        </div>

        {error && (
          <p className="mb-3 text-center text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-[50px] rounded-xl bg-[#8f3f56] text-base font-semibold text-white shadow-[0_8px_20px_rgba(143,63,86,0.25)] hover:bg-[#7a3448] disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="my-5 flex items-center gap-3 text-[13px] text-gray-500 before:h-px before:flex-1 before:bg-gray-200 before:content-[''] after:h-px after:flex-1 after:bg-gray-200 after:content-['']">
          <span>Or continue with</span>
        </div>

        <button type="button" className={social}>
          Google
        </button>
        <button type="button" className={social}>
          Apple
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            state={{ from }}
            className="font-semibold text-cherry hover:underline"
          >
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}