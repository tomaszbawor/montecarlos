// lib/react-query-provider.tsx// lib/react-query-provider.tsx
"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // We create the QueryClient only once (useState callback) to avoid re-instantiation
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          // Keep data indefinitely unless you want it refetched
          staleTime: Infinity,
          //cacheTime: Infinity,
        },
      },
    });

    if (typeof window !== "undefined") {
      const localStoragePersister = createSyncStoragePersister({
        storage: window.localStorage,
      });

      persistQueryClient({
        queryClient: client,
        persister: localStoragePersister,
        // You can configure options like dehydratedState etc. if needed
      });
    }

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
