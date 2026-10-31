import seed from "./data/cherry-cheek-JSON-Data/accounts.json";

// Demo passwords (front-end demo only)
function demoPassword(role) {
  if (role === "ADMIN") return "admin123";
  if (role === "CASHIER") return "cashier123";
  return "customer123";
}

// All accounts: saved ones, or the JSON file the first time
export function getUsers() {
  const saved = localStorage.getItem("users");
  if (saved) return JSON.parse(saved);

  const list = seed.map((a) => {
    const role = String(a.role || "CUSTOMER").toUpperCase();
    return {
      ...a,
      fullName: a.fullName || a.name || "",
      role,
      active: a.active !== false,
      password: a.password || demoPassword(role),
    };
  });
  localStorage.setItem("users", JSON.stringify(list));
  return list;
}

// Who is logged in (or null)
export function getUser() {
  const saved =
    localStorage.getItem("session") || sessionStorage.getItem("session");
  if (saved) return JSON.parse(saved);
  return null;
}

function saveSession(account, remember) {
  const { password, ...user } = account; // never store the password in the session
  localStorage.removeItem("session");
  sessionStorage.removeItem("session");
  if (remember) {
    localStorage.setItem("session", JSON.stringify(user));
  } else {
    sessionStorage.setItem("session", JSON.stringify(user));
  }
  return user;
}

// Returns the user, or null if email/password is wrong
export function login(email, password, remember = true) {
  const cleanEmail = email.trim().toLowerCase();
  const users = getUsers();

  for (const u of users) {
    if (u.email.toLowerCase() === cleanEmail && u.password === password && u.active) {
      return saveSession(u, remember);
    }
  }
  return null;
}

// Returns the new user, or throws an Error with a message to show
export function register(fullName, email, password) {
  const cleanEmail = email.trim().toLowerCase();
  const users = getUsers();

  for (const u of users) {
    if (u.email.toLowerCase() === cleanEmail) {
      throw new Error("An account with this email already exists.");
    }
  }

  const newUser = {
    id: Date.now(),
    fullName: fullName.trim(),
    email: cleanEmail,
    password,
    role: "CUSTOMER", // always CUSTOMER
    active: true,
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  return saveSession(newUser, true); // logged in right after signup
}

export function logout() {
  localStorage.removeItem("session");
  sessionStorage.removeItem("session");
}