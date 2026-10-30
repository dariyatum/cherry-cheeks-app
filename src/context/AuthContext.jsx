import { createContext, useContext, useState } from "react";
import seedUsers from "../data/cherry-cheek-JSON-Data/accounts.json";

const AuthContext = createContext(null);

const USERS_KEY = "users";
const SESSION_KEY = "session";

// Fake server delay. When you get a real backend, you can delete this.
const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Demo passwords for seed accounts that don't have one (front-end demo only)
const DEMO_PASSWORDS = {
  ADMIN: "admin123",
  CASHIER: "cashier123",
  CUSTOMER: "customer123",
};

function normalizeSeed(list) {
  return list.map((u) => ({
    ...u,
    fullName: u.fullName || u.name || "",
    role: String(u.role || "CUSTOMER").toUpperCase(),
    active: u.active !== false,
    password:
      u.password || DEMO_PASSWORDS[String(u.role).toUpperCase()] || "password123",
  }));
}

function loadUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {
    /* ignore corrupted storage */
  }
  const seeded = normalizeSeed(seedUsers);
  localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
  return seeded;
}

function loadSession() {
  try {
    const raw =
      localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// never keep the password in the session
const safe = ({ password, ...rest }) => rest;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession);

  const saveSession = (u, remember) => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    (remember ? localStorage : sessionStorage).setItem(
      SESSION_KEY,
      JSON.stringify(u)
    );
    setUser(u);
  };

  // async: returns a Promise. Callers must use await.
  const login = async (email, password, remember = true) => {
    await wait(); // later: replace with a real fetch()

    const found = loadUsers().find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password &&
        u.active
    );
    if (!found) return null;

    const u = safe(found);
    saveSession(u, remember);
    return u;
  };

  const register = async ({ fullName, email, password }) => {
    await wait();

    const users = loadUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: Date.now(),
      fullName: fullName.trim(),
      email: cleanEmail,
      password,
      role: "CUSTOMER", // always CUSTOMER, never from the form
      active: true,
    };

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    const u = safe(newUser);
    saveSession(u, true); // auto-login after signup
    return u;
  };

  // logout stays synchronous
  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}