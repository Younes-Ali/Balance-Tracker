import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createSheetsApi } from "../api/sheetsApi";

const SESSION_KEY = "raheeq_session";
const CACHE_KEY = "raheeq_cache";
const AuthContext = createContext(null);

function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return session && session.url && session.token ? session : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const api = useMemo(() => (session ? createSheetsApi(session) : null), [session]);

  const login = useCallback(async (url, token) => {
    const next = { url: url.trim(), token: token.trim() };
    await createSheetsApi(next).version();
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(CACHE_KEY);
    setSession(null);
  }, []);

  return <AuthContext.Provider value={{ session, api, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
