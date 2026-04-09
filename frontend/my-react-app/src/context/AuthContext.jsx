import React, { createContext, useContext, useState } from "react";
import { mockAPI } from "../mock/mockDatabase";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    try {
      // ── MOCK ──────────────────────────────────────────────────
      const data = await mockAPI.login(email, password);
      // ── API THẬT (bỏ comment 5 dòng dưới, xóa dòng mock trên) ─
      // const res = await fetch('/backend/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = res.ok ? await res.json() : null;
      // ──────────────────────────────────────────────────────────

      if (!data) return false;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const getToken = () => localStorage.getItem("token");

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
