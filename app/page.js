"use client";

import Header from "@/components/header";
import Dashboard from "@/components/dashboard/dashboard";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/user-context";
import { redirect } from "next/navigation";

export default function Index() {
  const { user } = useAuth();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
