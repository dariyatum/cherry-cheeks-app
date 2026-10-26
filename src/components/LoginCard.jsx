import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Page the user was on before opening login (falls back to home)
  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: replace with your real API call, then use the user it returns
    login({ name: email.split("@")[0], email });

    // Go back to where the user was; replace removes /login from history
    navigate(from, { replace: true });
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

        <button
          type="submit"
          className="h-[50px] rounded-xl bg-[#8f3f56] text-base font-semibold text-white shadow-[0_8px_20px_rgba(143,63,86,0.25)] hover:bg-[#7a3448]"
        >
          Sign in
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