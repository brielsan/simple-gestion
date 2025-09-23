"use client";

import { SWRConfig } from "swr";
import { fetcher } from "@/lib/fetcher";

export default function SWRProvider({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 0,
        dedupingInterval: 30000,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        loadingTimeout: 10000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
