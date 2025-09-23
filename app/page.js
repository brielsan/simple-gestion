import { getCurrentUser } from "@/lib/auth";
import Header from "@/components/header";
import Dashboard from "@/components/dashboard/dashboard";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-7xl mx-auto pb-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <p className="text-gray-600">
              Welcome back, <strong>{user?.username}</strong>.
            </p>
          </div>

          <Dashboard />
        </div>
      </main>
    </div>
  );
}
