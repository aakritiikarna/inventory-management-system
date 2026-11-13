import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pos-user")) || null;
    } catch {
      return null;
    }
  });

  // Accepts (userData, token) from Login.jsx and persists both under the
  // keys the API client (src/api/api.js) expects.
  const login = (userData, token) => {
    localStorage.setItem("pos-user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("pos-token", token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("pos-user");
    localStorage.removeItem("pos-token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
