"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  LogOut,
  Upload,
  Home,
  TrendingUp,
  Bot,
  Menu,
  X,
} from "lucide-react";

export default function Header({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoadingMockup, setIsLoadingMockup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleLoadMockup = async () => {
    setIsLoadingMockup(true);
    try {
      const response = await fetch("/api/mockup", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `Mock-up loaded successfully!\nMovements created: ${data.movementsCreated}`
        );
        router.refresh();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error loading the mock-up:", error);
      alert("Error in loading the mock-up");
    } finally {
      setIsLoadingMockup(false);
    }
  };

  const handleNavigation = (path) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const getNavButtonClasses = (path) => {
    const baseClasses =
      "flex items-center space-x-2 text-sm font-medium transition-colors";
    const activeClasses = "text-blue-600 bg-blue-50 px-3 py-2 rounded-md";
    const inactiveClasses =
      "text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md";

    return `${baseClasses} ${
      isActiveRoute(path) ? activeClasses : inactiveClasses
    }`;
  };

  const getMobileNavButtonClasses = (path) => {
    const baseClasses =
      "flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium rounded-md transition-colors";
    const activeClasses = "text-blue-600 bg-blue-50";
    const inactiveClasses =
      "text-gray-700 hover:text-blue-600 hover:bg-gray-100";

    return `${baseClasses} ${
      isActiveRoute(path) ? activeClasses : inactiveClasses
    }`;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1
              className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => handleNavigation("/")}
            >
              Simple Gestión
            </h1>

            <nav className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => handleNavigation("/")}
                className={getNavButtonClasses("/")}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => handleNavigation("/movements")}
                className={getNavButtonClasses("/movements")}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Movements</span>
              </button>

              <button
                onClick={() => handleNavigation("/asesoria")}
                className={getNavButtonClasses("/asesoria")}
              >
                <Bot className="h-4 w-4" />
                <span>AsesorIA</span>
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {user?.username}
            </span>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleLoadMockup}
                  disabled={isLoadingMockup}
                  className="cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isLoadingMockup ? "Loading..." : "Load Mock-up"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-1">
            <button
              onClick={() => handleNavigation("/")}
              className={getMobileNavButtonClasses("/")}
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleNavigation("/movements")}
              className={getMobileNavButtonClasses("/movements")}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Movements</span>
            </button>

            <button
              onClick={() => handleNavigation("/asesoria")}
              className={getMobileNavButtonClasses("/asesoria")}
            >
              <Bot className="h-4 w-4" />
              <span>AsesorIA</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
