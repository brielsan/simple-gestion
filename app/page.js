import { getCurrentUser } from "@/lib/auth";
import Header from "@/components/header";
import Dashboard from "@/components/dashboard/dashboard";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, CreditCard } from "lucide-react";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-7xl mx-auto pb-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Welcome back, <strong>{user?.username}</strong>.
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
              >
                <Plus className="h-4 w-4" />
                <DollarSign className="h-4 w-4" />
                Earnings
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <Plus className="h-4 w-4" />
                <CreditCard className="h-4 w-4" />
                Expenses
              </Button>
            </div>
          </div>

          <Dashboard />
        </div>
      </main>
    </div>
  );
}
