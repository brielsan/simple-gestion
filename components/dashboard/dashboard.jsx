"use client";

import { useMemo } from "react";
import {
  Loader2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard";
import CardDashboard from "./card-dashboard";
import CategoryChart from "./category-chart";
import TimelineChart from "./timeline-chart";
import TimelineBarChart from "./timeline-bar-chart";
import { formatCapitalize } from "@/utils/formats";
import CategoryBarChart from "./category-chart-bar";

export default function Dashboard() {
  const {
    stats: dashboardData,
    isLoading,
    error,
    mutate,
  } = useDashboardStats();

  const colorTimeline = useMemo(() => {
    if (!dashboardData) return "text-gray-600";
    return dashboardData.totalEarned + dashboardData.totalExpenses > 0
      ? "#00A63D"
      : "#E7000B";
  }, [dashboardData]);

  const dashboardCards = useMemo(
    () =>
      dashboardData && [
        {
          title: "Total Balance",
          amount: dashboardData.totalEarned + dashboardData.totalExpenses,
          description: "Summary of your balance",
          icon: DollarSign,
          color: "text-gray-600",
        },
        {
          title: "Total Earned",
          amount: dashboardData.totalEarned,
          description: "Sum of your earnings",
          icon: TrendingUp,
          color: "text-green-600",
        },
        {
          title: "Total Expenses",
          amount: Math.abs(dashboardData.totalExpenses),
          description: "Sum of your expenses",
          icon: TrendingDown,
          color: "text-red-600",
        },
        {
          title: "Top spending category",
          amount: dashboardData.topSpendingCategory
            ? Math.abs(dashboardData.topSpendingCategory.amount)
            : 0,
          description: dashboardData.topSpendingCategory
            ? formatCapitalize(dashboardData.topSpendingCategory.category)
            : "No data",
          icon: Target,
          color: "text-orange-600",
        },
      ],
    [dashboardData]
  );

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card, index) => (
          <CardDashboard
            key={index}
            title={card.title}
            amount={card.amount}
            description={card.description}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="hidden md:block">
          <CategoryChart data={dashboardData.categoryStats} />
        </div>
        <div className="block md:hidden">
          <CategoryBarChart data={dashboardData.categoryStats} />
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
    </div>
  );
}
