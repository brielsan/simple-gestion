import useSWR from "swr";
import { fetcherWithParams } from "@/lib/fetcher";

export function useMovements(filters = {}) {
  const {
    page = 1,
    limit = 20,
    categoryId,
    typeId,
    dateFrom,
    dateTo,
    description,
  } = filters;

  const params = {
    page: page.toString(),
    limit: limit.toString(),
  };

  if (categoryId && categoryId !== "all") {
    params.categoryId = categoryId;
  }

  if (typeId && typeId !== "all") {
    params.typeId = typeId;
  }

  if (dateFrom) {
    params.dateFrom = dateFrom.toISOString().split("T")[0];
  }

  if (dateTo) {
    params.dateTo = dateTo.toISOString().split("T")[0];
  }

  if (description && description.trim() !== "") {
    params.description = description;
  }

  const { data, error, isLoading, mutate } = useSWR(
    ["/api/movements", params],
    ([url, params]) => fetcherWithParams(url, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    movements: data?.movements || [],
    pagination: data?.pagination || {},
    totalAmount: data?.totalAmount || 0,
    isLoading,
    error,
    mutate,
  };
}
