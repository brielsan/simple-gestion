import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export function useAdvice() {
  const { data, error, isLoading } = useSWR("/api/ai/advice", fetcher);
  return { data, error, isLoading };
}
