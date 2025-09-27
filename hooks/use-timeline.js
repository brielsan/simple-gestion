import useSWR from "swr";

export function useTimelineStats(period = "months") {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/dashboard/timeline?period=${period}`
  );

  return {
    timelineData: data || [],
    isLoading,
    error,
    mutate,
  };
}
