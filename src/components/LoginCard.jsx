import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png"; // replace with your brand's logo

// Change these for each brand
const BRAND_NAME = "Cherry Cheek";
const BRAND_COLOR = "#8f3f56";
const BRAND_COLOR_HOVER = "#7a3448";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const user = login(email, password);

    if (!user) {
      setError("Wrong email or password");
      return;
    }

    navigate(user.role === "admin" ? "/admin" : "/dashboard");
  };

  const input =
    "mt-2 mb-5 h-[50px] w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-[15px] focus:outline-none";
  const label = "text-sm font-medium text-gray-700";
  const link = "text-sm font-medium text-blue-600 hover:underline";
  const social =
    "mb-3 h-[50px] rounded-xl border border-gray-200 bg-white text-[15px] text-gray-700 hover:bg-gray-50";

  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[600px] flex-col rounded-[20px] bg-white px-5 py-7 shadow-[0_10px_40px_rgba(0,0,0,0.08)] sm:rounded-[28px] sm:p-12"
      >
        <img src={logo} alt={`${BRAND_NAME} logo`} className="w-20 self-center" />
        <h1 className="mb-1 mt-2 text-center text-2xl font-bold text-[#141b2d] sm:text-3xl">
          Welcome Back To {BRAND_NAME}
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
          <a href="/forgot-password" className={link}>
            Forgot password?
          </a>
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
              className="h-4 w-4 accent-blue-600"
            />
            Remember me
          </label>
          <a href="/help" className={link}>
            Need help?
          </a>
        </div>

        {error && (
          <p className="mb-3 text-center text-sm text-red-600">{error}</p>
        )}
        
        <button
          type="submit"
          style={{ backgroundColor: BRAND_COLOR }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = BRAND_COLOR_HOVER)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = BRAND_COLOR)}
          className="h-[50px] rounded-xl text-base font-semibold text-white shadow-lg"
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
          <a href="/register" className="font-semibold text-blue-600 hover:underline">
            Create Account
          </a>
        </p>
      </form>
    </div>
  );
}