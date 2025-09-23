import { Suspense } from "react";
import { redirect } from "next/navigation";
import Header from "@/components/header";
import MovementsPage from "@/components/movements/movements-page";
import { getCurrentUser } from "@/lib/auth";

export default async function Movements() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Movements</h1>
          <p className="mt-2 text-gray-600">
            Manage and filter all your financial movements
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <MovementsPage />
        </Suspense>
      </main>
    </div>
  );
}
