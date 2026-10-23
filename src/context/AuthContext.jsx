import { createContext, useContext, useState } from "react";
import { users } from "../data/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Read the saved user once on first load, so a refresh keeps you logged in
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Returns the user if the email/password match, otherwise null
  const login = (email, password) => {
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return null;

    const { password: _pw, ...safeUser } = found; // never store the password
    localStorage.setItem("user", JSON.stringify(safeUser));
    setUser(safeUser);
    return safeUser;
  };

  const logout = () => {
    localStorage.removeItem("user");
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