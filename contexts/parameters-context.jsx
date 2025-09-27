"use client";

import { createContext, useContext, useState } from "react";

const ParametersContext = createContext({
  categories: [],
  types: [],
  isLoading: false,
  error: null,
  loadParameters: () => {},
});

let isLoadingGlobal = false;

export function ParametersProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadParameters = async () => {
    if (categories.length > 0 && types.length > 0) {
      return;
    }

    if (isLoadingGlobal) {
      setIsLoading(true);
      return;
    }

    const fetchParameters = async () => {
      isLoadingGlobal = true;
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/movements/filters");
        const data = await response.json();

        if (response.ok) {
          setCategories(data.categories);
          setTypes(data.types);
        } else {
          setError(data.error || "Error loading parameters");
        }
      } catch (err) {
        setError("Error loading parameters");
        console.error("Error fetching parameters:", err);
      } finally {
        setIsLoading(false);
        isLoadingGlobal = false;
      }
    };

    await fetchParameters();
  };

  return (
    <ParametersContext.Provider
      value={{
        categories,
        types,
        isLoading,
        error,
        loadParameters,
      }}
    >
      {children}
    </ParametersContext.Provider>
  );
}

export function useParameters() {
  const context = useContext(ParametersContext);
  if (context === undefined) {
    throw new Error("useParameters must be used within a ParametersProvider");
  }
  return context;
}
