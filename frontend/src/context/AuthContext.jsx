import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from 'react';

/**
 * AuthContext
 *
 * Global frontend state for user authentication.
 *
 * Responsibilities:
 * - Store current user object
 * - Store isAuthenticated flag
 * - Store loading/error states for auth operations
 * - Provide login() / logout() / updateUser() / clearSession() actions
 *
 * State management only.
 * No API calls — delegates to services/api.js.
 * No business logic — purely authentication state.
 * No duplicate of axios interceptors (handled in api.js).
 */

const USER_STORAGE_KEY = 'user';
const ACCESS_TOKEN_KEY = 'accessToken';

export const AuthContext = createContext(null);

function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Corrupted storage — ignore
  }
  return null;
}

function getStoredToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Derive isAuthenticated from stored token
  const isAuthenticated = Boolean(getStoredToken() || user);

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } catch {
        // Storage full — handle silently
      }
    } else {
      try {
        localStorage.removeItem(USER_STORAGE_KEY);
      } catch {
        // Silently fail
      }
    }
  }, [user]);

  const login = useCallback((userData, token) => {
    if (token) {
      try {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
      } catch {
        // Silently fail
      }
    }
    setUser(userData);
    setError(null);
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem('refreshToken');
    } catch {
      // Silently fail
    }
    setUser(null);
    setError(null);
    setLoading(false);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const clearSession = useCallback(() => {
    logout();
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      error,
      login,
      logout,
      updateUser,
      clearSession,
      setLoading,
      setError,
    }),
    [user, isAuthenticated, loading, error, login, logout, updateUser, clearSession],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

/**
 * useAuth
 *
 * Custom hook to consume AuthContext.
 * Throws if used outside AuthProvider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}

