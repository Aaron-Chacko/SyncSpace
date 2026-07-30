import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/auth";

const AuthContext = createContext(null);
const TOKEN_KEY = "syncspace.token";
const USER_KEY = "syncspace.user";

const storedUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const login = ({ user: userData, token: authToken }) => {
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  useEffect(() => {
    authService.refresh().then(login).catch(() => {
      // A missing or expired refresh cookie is normal for a new visitor.
    });
  }, []);

  const logout = async () => {
    try { await authService.logout(); } catch { /* Always clear local session. */ }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(user && token), login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
