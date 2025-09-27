"use client";

import { useMemo, useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import { Alert } from "@/utils/alerts";
import { useAuth } from "@/contexts/user-context";

const routes = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/movements", label: "Movements", icon: TrendingUp },
];

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoadingMockup, setIsLoadingMockup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleLoadMockup = async () => {
    setIsLoadingMockup(true);
    try {
      const response = await fetch("/api/mockup", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        Alert(
          "Mock-up loaded successfully!",
          `Movements created: ${data.movementsCreated}`,
          "success",
          3000
        );
        router.refresh();
      } else {
        Alert("Error", `${data.error}`, "error");
      }
    } catch (error) {
      console.error("Error loading the mock-up:", error);
      Alert("Error", "Error in loading the mock-up", "error");
    } finally {
      setIsLoadingMockup(false);
    }
  };

  const settings = useMemo(
    () => [
      {
        label: "Load Mock-up",
        icon: Upload,
        onClick: handleLoadMockup,
        disabled: isLoadingMockup,
      },
      { label: "Logout", icon: LogOut, onClick: handleLogout },
    ],
    [isLoadingMockup]
  );

  const handleNavigation = (path) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return pathname.startsWith(path);
  };

  const getNavButtonClasses = (path) => {
    const baseClasses =
      "flex items-center space-x-2 text-sm font-medium transition-colors cursor-pointer";
    const activeClasses = "text-blue-600 bg-blue-50 px-3 py-2 rounded-md";
    const inactiveClasses =
      "text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md";

    return `${baseClasses} ${
      isActiveRoute(path) ? activeClasses : inactiveClasses
    }`;
  };

  const getMobileNavButtonClasses = (path) => {
    const baseClasses =
      "flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer";
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
              onClick={() => handleNavigation("/dashboard")}
            >
              Simple Gestión
            </h1>

            <nav className="hidden md:flex items-center space-x-2">
              {routes.map((route) => (
                <button
                  key={route.path}
                  onClick={() => handleNavigation(route.path)}
                  className={getNavButtonClasses(route.path)}
                >
                  <route.icon className="h-4 w-4" />
                  <span>{route.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 sm:block hidden">
              Welcome, {user?.username}
            </span>

            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {settings.map((setting) => (
                    <DropdownMenuItem
                      key={setting.label}
                      onClick={setting.onClick}
                      disabled={setting.disabled}
                      className="cursor-pointer"
                    >
                      <setting.icon className="h-4 w-4 mr-2" />
                      {setting.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

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
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-1">
            {routes.map((route) => (
              <button
                key={route.path}
                onClick={() => handleNavigation(route.path)}
                className={getMobileNavButtonClasses(route.path)}
              >
                <route.icon className="h-4 w-4" />
                <span>{route.label}</span>
              </button>
            ))}

            <div className="border-t border-gray-200 my-2"></div>

            {settings.map((setting) => (
              <button
                key={setting.label}
                onClick={() => {
                  setting.onClick();
                  setIsMobileMenuOpen(false);
                }}
                disabled={setting.disabled}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer text-gray-700 hover:text-blue-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <setting.icon className="h-4 w-4" />
                <span>{setting.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
