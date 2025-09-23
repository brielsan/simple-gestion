import useSWR from "swr";

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR("/api/dashboard/stats", {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    stats: data || {},
    isLoading,
    error,
    mutate,
  };
}
