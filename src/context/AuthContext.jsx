import { createContext, useContext, useState } from "react";
import { users } from "../data/user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Returns the user if the email/password match, otherwise null
  const login = (email, password, remember = true) => {
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return null;

    const { password: _pw, ...safeUser } = found; // never store the password
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(safeUser));
    setUser(safeUser);
    return safeUser;
  };

  const logout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}