"use client";

import { QueryClient, QueryClientContextProvider } from "@kyoungah.me/query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function QueryClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientContextProvider client={queryClient}>
      {children}
    </QueryClientContextProvider>
  );
}

export { QueryClientProvider };
