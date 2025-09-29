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
  Home,
  TrendingUp,
  Menu,
  X,
  Wrench,
  HelpCircle,
} from "lucide-react";
import { Alert, Confirm } from "@/utils/alerts";
import { useAuth } from "@/contexts/user-context";
import { useSWRConfig } from "swr";
import AppTutorial from "@/components/tutorial/app-tutorial";

const routes = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/movements", label: "Movements", icon: TrendingUp },
];

export default function Header() {
  const { user, logout, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoadingMockup, setIsLoadingMockup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { mutate } = useSWRConfig();

  const handleLogout = async () => {
    await logout();
  };

  const handleTestMode = async () => {
    try {
      const isEnabling = !user?.testmode;

      if (isEnabling) {
        if (
          !(await Confirm(
            "Enable Test Mode",
            "This will activate test mode and load sample data to help you explore the application features. All existing movements will be deleted and replaced with sample data. All existing advice will be marked as deleted. This action cannot be undone.",
            "warning"
          ))
        ) {
          return;
        }
      } else {
        if (
          !(await Confirm(
            "Disable Test Mode",
            "This will disable test mode and delete all your movements. All your advice will be marked as deleted. You will start with a clean slate. This action cannot be undone.",
            "warning"
          ))
        ) {
          return;
        }
      }

      setIsLoadingMockup(true);
      const response = await fetch("/api/mockup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testmode: isEnabling }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user) {
          const updatedUser = { ...user, testmode: data.user.testmode };
          setUser(updatedUser);
        }

        Alert(
          isEnabling
            ? "Test mode enabled successfully!"
            : "Test mode disabled successfully!",
          isEnabling
            ? `Sample data loaded: ${data.movementsCreated} movements created`
            : "All movements and advice have been deleted",
          "success"
        );
        mutate((key) => true);
      } else {
        Alert("Error", `${data.error}`, "error");
      }
    } catch (error) {
      console.error("Error handling test mode:", error);
      Alert("Error", "Error in test mode operation", "error");
    } finally {
      setIsLoadingMockup(false);
    }
  };

  const settings = useMemo(
    () => [
      {
        label: "Start Tutorial",
        icon: HelpCircle,
        onClick: () => {
          // Trigger tutorial
          const tutorialButton = document.querySelector(
            "[data-tutorial-trigger]"
          );
          if (tutorialButton) {
            tutorialButton.click();
          }
        },
      },
      {
        label: user?.testmode ? "Disable Test Mode" : "Enable Test Mode",
        icon: Wrench,
        onClick: handleTestMode,
        disabled: isLoadingMockup,
      },
      { label: "Logout", icon: LogOut, onClick: handleLogout },
    ],
    [isLoadingMockup, user?.testmode]
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
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1
              className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => handleNavigation("/dashboard")}
            >
              <span className="hidden sm:inline">Simple Gestión</span>
              <span className="sm:hidden">S.G</span>
            </h1>

            <nav
              className="hidden md:flex items-center space-x-2"
              data-tutorial="navigation"
            >
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
            {user?.testmode && (
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                data-tutorial="test-mode"
              >
                Test Mode
              </span>
            )}
            <span className="text-sm text-gray-700 sm:block hidden">
              Welcome, {user?.username}
            </span>

            <div className="hidden">
              <AppTutorial />
            </div>

            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    data-tutorial="settings-button"
                  >
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
              data-tutorial="mobile-menu-button"
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
