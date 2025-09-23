"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Loader2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
} from "lucide-react";
import CardDashboard from "./card-dashboard";
import CategoryChart from "./category-chart";
import TimelineChart from "./timeline-chart";
import { formatCapitalize } from "@/utils/formats";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        const data = await response.json();

        if (response.ok) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const colorTimeline = useMemo(() => {
    if (!dashboardData) return "text-gray-600";
    return dashboardData.totalEarned + dashboardData.totalPaid > 0
      ? "#00A63D"
      : "#E7000B";
  }, [dashboardData]);

  const dashboardCards = useMemo(
    () =>
      dashboardData && [
        {
          title: "Total Balance",
          amount: dashboardData.totalEarned + dashboardData.totalPaid,
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
          title: "Total Paid",
          amount: Math.abs(dashboardData.totalPaid),
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Error loading dashboard data</p>
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
        <CategoryChart data={dashboardData.categoryStats} />
        <TimelineChart
          data={dashboardData.monthlyStats}
          color={colorTimeline}
        />
      </div>
    </div>
  );
}
