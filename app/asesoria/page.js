import { Suspense } from "react";
import { redirect } from "next/navigation";
import Header from "@/components/header";
import { getCurrentUser } from "@/lib/auth";

export default async function Asesoria() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AsesorIA</h1>
          <p className="mt-2 text-gray-600">
            Your intelligent assistant for financial management
          </p>
        </div>
      </main>
    </div>
  );
}
