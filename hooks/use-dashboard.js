import useSWR from "swr";

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR("/api/dashboard/stats");

  const stats = data
    ? {
        ...data,
        totalIncome: Number(data.totalIncome || 0),
        totalExpenses: Number(data.totalExpenses || 0),
      }
    : {
        totalIncome: 0,
        totalExpenses: 0,
        categoryStats: [],
        monthlyStats: [],
        totalMovements: 0,
      };

  return {
    stats,
    isLoading,
    error,
    mutate,
  };
}
