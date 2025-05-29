"use client";

import { QueryClient, QueryClientContextProvider } from "@kyoungah.me/query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const queryClient = new QueryClient();

function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  useEffect(() => {
    console.log(1, queryClient.getQueryCache());
  }, [path]);

  return (
    <QueryClientContextProvider client={queryClient}>
      {children}
    </QueryClientContextProvider>
  );
}

export { QueryClientProvider };
