"use client";

import Header from "@/components/header";
import Dashboard from "@/components/dashboard/dashboard";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/user-context";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto pb-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Dashboard />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
