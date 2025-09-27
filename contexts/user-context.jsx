"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useParameters } from "./parameters-context";
import { mutate } from "swr";
import { useSWRConfig } from "swr";

const UserContext = createContext({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  checkAuth: () => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { loadParameters } = useParameters();
  const { mutate } = useSWRConfig();
  const checkAuth = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setIsAuthenticated(true);
        loadParameters();
      } else {
        setUser(null);
        setIsAuthenticated(false);
        if (pathname !== "/login" && pathname !== "/register") {
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
      setIsAuthenticated(false);
      if (pathname !== "/login" && pathname !== "/register") {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      mutate((key) => true, undefined, { revalidate: false });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");

      window?.location?.reload();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
}
