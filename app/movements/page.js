"use client";

import Header from "@/components/header";
import ProtectedRoute from "@/components/auth/protected-route";
import dynamic from "next/dynamic";
import Loader from "@/components/ui/loader";

const MovementsPage = dynamic(
  () => import("@/components/movements/movements-page"),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

export default function Movements() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Movements</h1>
          </div>
          <MovementsPage />
        </main>
      </div>
    </ProtectedRoute>
  );
}
