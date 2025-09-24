"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { movementCrudService } from "@/services/movement-crud-service";
import TotalBalanceCard from "./total-balance-card";
import AsesoriaCard from "./asesoria-card";
import CategoryChart from "./category-chart";
import TimelineChart from "./timeline-chart";
import TimelineBarChart from "./timeline-bar-chart";
import CategoryBarChart from "./category-chart-bar";
import MovementModal from "../movements/movement-modal";
import { mutate as mutateGeneral } from "swr";
import { IncomeButton } from "../ui/income-button";
import { ExpenseButton } from "../ui/expense-button";

export default function Dashboard({ user }) {
  const {
    stats: dashboardData,
    isLoading,
    error,
    mutate,
  } = useDashboardStats();

  const [showModal, setShowModal] = useState(false);
  const [preSelectedType, setPreSelectedType] = useState(null);

  const handleCreateMovement = async (movementData) => {
    try {
      await movementCrudService.createMovement(movementData);
      mutate();
      mutateGeneral("/api/dashboard/stats");
    } catch (error) {
      console.error("Error creating movement:", error);
      alert("Error creating movement: " + error.message);
    }
  };

  const openCreateModal = (typeName = null) => {
    setPreSelectedType(typeName);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPreSelectedType(null);
  };

  const colorTimeline = useMemo(() => {
    if (!dashboardData) return "text-gray-600";
    return dashboardData.totalIncome + dashboardData.totalExpenses > 0
      ? "#00A63D"
      : "#E7000B";
  }, [dashboardData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-2">Error loading dashboard data</p>
        <button
          onClick={() => mutate()}
          className="text-blue-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <p className="text-gray-600">
            Welcome back, <strong>{user?.username}</strong>.
          </p>
        </div>
        <div className="flex gap-2">
          <IncomeButton onClick={() => openCreateModal("income")} />
          <ExpenseButton onClick={() => openCreateModal("expense")} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <TotalBalanceCard
          incomes={dashboardData.totalIncome}
          expenses={dashboardData.totalExpenses}
          total={dashboardData.totalIncome - dashboardData.totalExpenses}
        />

        <div>
          <AsesoriaCard />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="hidden md:block">
          <CategoryChart data={dashboardData.categoryData} />
        </div>
        <div className="block md:hidden">
          <CategoryBarChart data={dashboardData.categoryData} />
        </div>
        <div className="hidden md:block">
          <TimelineChart
            data={dashboardData.monthlyStats}
            color={colorTimeline}
          />
        </div>
        <div className="block md:hidden">
          <TimelineBarChart
            data={dashboardData.monthlyStats}
            color={colorTimeline}
          />
        </div>
      </div>

      <MovementModal
        isOpen={showModal}
        onClose={closeModal}
        onSave={handleCreateMovement}
        preSelectedType={preSelectedType}
      />
    </div>
  );
}
