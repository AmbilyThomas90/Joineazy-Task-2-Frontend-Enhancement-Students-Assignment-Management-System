import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../api/mockApi';

const AuthContext = createContext(null);
const TOKEN_KEY = 'sagms_token';
// AuthProvider provides authentication data and functions
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    api.getCurrentUser(token).then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);
  // Login function.
  async function login(email, password) {
    const { token, user } = await api.login({ email, password });
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
    return user;
  }
 // Register function
  async function register(name, email, password, role) {
    const { token, user } = await api.register({ name, email, password, role });
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
    return user;
  }
// Logout function.
  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
