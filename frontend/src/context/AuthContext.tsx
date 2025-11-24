// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

// ---------- Types ----------
interface LoginPayload {
  token: string;
  userId: string;
  username: string;
}

interface AuthContextType {
  authToken: string | null;
  userId: string | null;
  username: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginPayload) => void;
  logout: () => void;
}

interface ProviderProps {
  children: ReactNode;
}

// Create strongly-typed context
const AuthContext = createContext<AuthContextType | null>(null);

// Hook for easy access
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};

export const AuthProvider: React.FC<ProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage once on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUserId = localStorage.getItem("loggedInUserId");
    const storedUsername = localStorage.getItem("username");

    if (storedToken && storedUserId && storedUsername) {
      setAuthToken(storedToken);
      setUserId(storedUserId);
      setUsername(storedUsername);

      axios.defaults.headers.common["x-auth-token"] = storedToken;
    }

    setLoading(false);
  }, []);

  // Sync axios header when token changes
  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common["x-auth-token"] = authToken;
    } else {
      axios.defaults.headers.common["x-auth-token"] = "";
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [authToken]);

  // Login
  const login = ({ token, userId, username }: LoginPayload) => {
    setAuthToken(token);
    setUserId(userId);
    setUsername(username);

    localStorage.setItem("authToken", token);
    localStorage.setItem("loggedInUserId", userId);
    localStorage.setItem("username", username);
  };

  // Logout
  const logout = () => {
    setAuthToken(null);
    setUserId(null);
    setUsername(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("username");

    axios.defaults.headers.common["x-auth-token"] = "";
  };

  const value: AuthContextType = {
    authToken,
    userId,
    username,
    loading,
    isAuthenticated: !!authToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
