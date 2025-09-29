"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

const UserContext = createContext({
  user: null,
  isLoading: false,
  setUser: () => {},
  setIsLoading: () => {},
  login: () => {},
  logout: () => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const login = (userData) => {
    setUser(userData);
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
      router.push("/login");

      window?.location?.reload();
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        setUser,
        setIsLoading,
        login,
        logout,
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
