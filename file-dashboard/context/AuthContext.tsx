"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { refreshAccessToken } from "@/api/auth";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
};

let accessToken: string | null = null;

export const setStoredAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getStoredAccessToken = () => accessToken;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const { accessToken: newToken } = await refreshAccessToken();
        setUsername(localStorage.getItem("username") || "");
        setUserId(localStorage.getItem("userId") || "");
        setAccessToken(newToken);
        setStoredAccessToken(newToken);
      } catch (err: any) {
        console.log("Failed to refresh token");
      }
    };
    loadAuth();
  }, []);

  useEffect(() => {
    setStoredAccessToken(accessToken);
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        username,
        setUsername,
        userId,
        setUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a provider");
  return context;
};

