"use client";

import { useAuth } from "@/contexts/user-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const { user, setUser } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      setIsCheckingAuth(true);

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
      } else {
        setUser(null);
        if (pathname !== "/login" && pathname !== "/register") {
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
      if (pathname !== "/login" && pathname !== "/register") {
        router.push("/login");
      }
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    if (!user) {
      checkAuth();
    } else {
      setIsCheckingAuth(false);
    }
  }, [user]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
