"use client";

import { useMemo, useState } from "react";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { useTimelineStats } from "@/hooks/use-timeline";
import { movementCrudService } from "@/services/client/movement-crud-service";
import TotalBalanceCard from "./total-balance-card";
import AsesoriaCard from "./asesoria-card";
import { mutate as mutateGeneral } from "swr";
import { IncomeButton } from "../ui/income-button";
import { ExpenseButton } from "../ui/expense-button";
import dynamic from "next/dynamic";
import Loader from "../ui/loader";
import { Alert } from "@/utils/alerts";
import { useAuth } from "@/contexts/user-context";

const CategoryChart = dynamic(() => import("./category-chart"), {
  ssr: false,
  loading: () => <Loader />,
});
const TimelineChart = dynamic(() => import("./timeline-chart"), {
  ssr: false,
  loading: () => <Loader />,
});
const TimelineBarChart = dynamic(() => import("./timeline-bar-chart"), {
  ssr: false,
  loading: () => <Loader />,
});
const CategoryBarChart = dynamic(() => import("./category-chart-bar"), {
  ssr: false,
  loading: () => <Loader />,
});
const MovementModal = dynamic(() => import("../movements/movement-modal"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function Dashboard() {
  const { user } = useAuth();

  const [timelinePeriod, setTimelinePeriod] = useState("months");

  const {
    stats: dashboardData,
    isLoading,
    error,
    mutate,
  } = useDashboardStats();

  const {
    timelineData,
    isLoading: timelineLoading,
    error: timelineError,
    mutate: mutateTimeline,
  } = useTimelineStats(timelinePeriod);

  const [showModal, setShowModal] = useState(false);
  const [preSelectedType, setPreSelectedType] = useState(null);

  const handleCreateMovement = async (movementData) => {
    try {
      await movementCrudService.createMovement(movementData);
      // update dashboard stats
      mutate();
      mutateTimeline();
      // invalidate cached movements (all pages and filters)
      mutateGeneral((key) => {
        return formatSWRKey(key).startsWith("/api/movements");
      });
    } catch (error) {
      console.error("Error creating movement:", error);
      Alert("Error", "Error creating movement: " + error.message, "error");
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

  const handleTimelineChange = (period) => {
    setTimelinePeriod(period);
  };

  const colorTimeline = useMemo(() => {
    if (!dashboardData) return "text-gray-600";
    return dashboardData.totalIncome + dashboardData.totalExpenses > 0
      ? "#00A63D"
      : "#E7000B";
  }, [dashboardData]);

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
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <p className="text-gray-600">
            Welcome back, <strong>{user?.username}</strong>.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <IncomeButton onClick={() => openCreateModal("income")} />
          <ExpenseButton onClick={() => openCreateModal("expense")} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <TotalBalanceCard
          incomes={dashboardData.totalIncome}
          expenses={dashboardData.totalExpenses}
          total={dashboardData.totalIncome - dashboardData.totalExpenses}
          loading={isLoading}
        />

        <div>
          <AsesoriaCard />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="hidden md:block">
          <CategoryChart
            data={dashboardData.categoryData}
            isLoading={isLoading}
          />
        </div>
        <div className="block md:hidden">
          <CategoryBarChart
            data={dashboardData.categoryData}
            isLoading={isLoading}
          />
        </div>
        <div className="hidden md:block">
          <TimelineChart
            data={timelineData}
            color={colorTimeline}
            period={timelinePeriod}
            onPeriodChange={handleTimelineChange}
            isLoading={timelineLoading}
          />
        </div>
        <div className="block md:hidden">
          <TimelineBarChart
            data={timelineData}
            color={colorTimeline}
            period={timelinePeriod}
            onPeriodChange={handleTimelineChange}
            isLoading={timelineLoading}
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
