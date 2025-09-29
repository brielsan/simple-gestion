import useSWR from "swr";

export function useParameters() {
  const { data, error, isLoading, mutate } = useSWR("/api/movements/filters");

  const parameters = data
    ? {
        categories: data.categories || [],
        types: data.types || [],
      }
    : {
        categories: [],
        types: [],
      };

  return {
    categories: parameters.categories,
    types: parameters.types,
    isLoading,
    error,
    mutate,
  };
}
