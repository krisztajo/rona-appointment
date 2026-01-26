"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserPublic, UserRole } from '@/types/database';

// Auth context típusok
interface AuthContextType {
  user: UserPublic | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// LocalStorage kulcsok
const TOKEN_KEY = 'rona_auth_token';
const USER_KEY = 'rona_auth_user';

// Admin szerepkörök
const ADMIN_ROLES: UserRole[] = ['admin', 'doctor', 'superadmin'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Bejelentkezési állapot betöltése localStorage-ból
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const savedToken = localStorage.getItem(TOKEN_KEY);
        const savedUser = localStorage.getItem(USER_KEY);

        if (savedToken && savedUser) {
          // Token érvényesség ellenőrzése
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${savedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setUser(data.data);
              setToken(savedToken);
            } else {
              // Érvénytelen token, töröljük
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(USER_KEY);
            }
          } else {
            // Érvénytelen token
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        }
      } catch (error) {
        console.error('Auth state load error:', error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Bejelentkezés
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setUser(data.data.user);
        setToken(data.data.token);
        localStorage.setItem(TOKEN_KEY, data.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Bejelentkezési hiba' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Hálózati hiba történt' };
    }
  }, []);

  // Regisztráció
  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setUser(data.data.user);
        setToken(data.data.token);
        localStorage.setItem(TOKEN_KEY, data.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Regisztrációs hiba' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Hálózati hiba történt' };
    }
  }, []);

  // Kijelentkezés
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  // Jelszó változtatás
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!token) {
      return { success: false, error: 'Nincs bejelentkezve' };
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Jelszó változtatási hiba' };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Hálózati hiba történt' };
    }
  }, [token]);

  // Felhasználói adatok frissítése
  const refreshUser = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        setUser(data.data);
        localStorage.setItem(USER_KEY, JSON.stringify(data.data));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }, [token]);

  // Számított értékek
  const isAuthenticated = !!user && !!token;
  const isAdmin = !!user && ADMIN_ROLES.includes(user.role);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    changePassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook a context használatához
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hook: csak bejelentkezett felhasználóknak
export function useRequireAuth(redirectTo?: string) {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated && redirectTo) {
      window.location.href = redirectTo;
    }
  }, [auth.isLoading, auth.isAuthenticated, redirectTo]);

  return auth;
}

// Helper hook: csak admin felhasználóknak
export function useRequireAdmin(redirectTo?: string) {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAdmin && redirectTo) {
      window.location.href = redirectTo;
    }
  }, [auth.isLoading, auth.isAdmin, redirectTo]);

  return auth;
}
