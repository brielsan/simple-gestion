"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, Upload } from "lucide-react";

export default function Header({ user }) {
  const router = useRouter();
  const [isLoadingMockup, setIsLoadingMockup] = useState(false);

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
          `Mock-up cargado exitosamente!\nMovimientos creados: ${data.movementsCreated}`
        );
        router.refresh();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al cargar mock-up:", error);
      alert("Error al cargar el mock-up");
    } finally {
      setIsLoadingMockup(false);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Simple Gestión
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Hola, {user?.username}
            </span>

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
                  {isLoadingMockup ? "Cargando..." : "Cargar Mock-up"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
