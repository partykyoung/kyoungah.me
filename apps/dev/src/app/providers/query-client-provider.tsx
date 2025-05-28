"use client";

import { QueryClient, QueryClientContextProvider } from "@kyoungah.me/query";

const queryClient = new QueryClient();

function QueryClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientContextProvider client={queryClient}>
      {children}
    </QueryClientContextProvider>
  );
}

export { QueryClientProvider };
