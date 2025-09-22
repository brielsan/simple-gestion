import { getCurrentUser } from "@/lib/auth";
import Header from "@/components/header";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"></main>
    </div>
  );
}
