"use client";

import { createContext, useContext } from "react";
import { useParameters } from "./parameters-context";

const FiltersContext = createContext({
  categories: [],
  types: [],
  isLoading: false,
  error: null,
});

export function FiltersProvider({ children }) {
  const { categories, types, isLoading, error } = useParameters();

  return (
    <FiltersContext.Provider
      value={{
        categories,
        types,
        isLoading,
        error,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }
  return context;
}
