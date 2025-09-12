import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { setAuthToken, clearAuthToken } from "../services/api";
import type { User, AuthContext } from "./types";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("auth_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      const tok = localStorage.getItem("auth_token");
      if (raw) setUser(JSON.parse(raw));
      if (tok) {
        setToken(tok);
        setAuthToken(tok);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem("auth_user", JSON.stringify(user));
      else localStorage.removeItem("auth_user");
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      if (token) localStorage.setItem("auth_token", token);
      else localStorage.removeItem("auth_token");
    } catch {}
  }, [token]);

  const login = () => {
    const demo = { name: "Christopher Tolang", email: "christoper@demo.com" };
    const demoToken = "theflex-demo";
    setUser(demo);
    setToken(demoToken);
    setAuthToken(demoToken);
    navigate("/dashboard/management/reviews", { replace: true });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearAuthToken();
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
