"use client";

import { SWRConfig } from "swr";
import { fetcher } from "@/lib/fetcher";

function localStorageProvider() {
  if (typeof window === "undefined") {
    return new Map();
  }

  const map = new Map(JSON.parse(localStorage.getItem("app-cache") || "[]"));

  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem("app-cache", appCache);
  });

  return map;
}

export default function SWRProvider({ children }) {
  return (
    <SWRConfig
      value={{
        provider: localStorageProvider,
        fetcher,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 0,
        dedupingInterval: 300000, // deduping 5 minutes (si no se hace mutate)
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        loadingTimeout: 10000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
