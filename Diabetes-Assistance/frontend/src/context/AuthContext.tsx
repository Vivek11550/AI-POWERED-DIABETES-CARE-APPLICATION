import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  token: string | null;
  role: string | null;
  profileCompleted: boolean | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    token: string,
    role: string,
    profileCompleted: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profileCompleted, setProfileCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** 🔑 Restore session on app start */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedRole = await AsyncStorage.getItem("role");
        const storedProfile = await AsyncStorage.getItem("profileCompleted");

        if (storedToken) {
          setToken(storedToken);
          setRole(storedRole);
          setProfileCompleted(storedProfile === "true");
        }
      } catch (error) {
        console.log("Session restore failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  /** 🔐 Login */
  const login = async (
    newToken: string,
    newRole: string,
    newProfileCompleted: boolean
  ) => {
    try {
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("role", newRole);
      await AsyncStorage.setItem(
        "profileCompleted",
        String(newProfileCompleted)
      );

      setToken(newToken);
      setRole(newRole);
      setProfileCompleted(newProfileCompleted);
    } catch (error) {
      console.log("Login storage error:", error);
    }
  };

  /** 🚪 Logout */
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "token",
        "role",
        "profileCompleted",
      ]);

      setToken(null);
      setRole(null);
      setProfileCompleted(null);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        profileCompleted,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/** 🔑 Hook */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};