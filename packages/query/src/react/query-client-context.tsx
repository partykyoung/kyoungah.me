"use client";

import { useEffect, useContext, createContext } from "react";

export const QueryClientContext = createContext<any>(undefined);

function useQueryClient(queryClient: any) {
  const client = useContext(QueryClientContext);

  if (queryClient) {
    return queryClient;
  }

  if (client === undefined || client === null) {
    throw new Error(
      "No QueryClient set, use QueryClientContextProvider to set one."
    );
  }
}

function QueryClientContextProvider({ client, children }: any) {
  useEffect(() => {
    client.mount();

    return () => {
      client.unmount();
    };
  }, [client]);

  return (
    <QueryClientContext.Provider value={client}>
      {children}
    </QueryClientContext.Provider>
  );
}

export { useQueryClient, QueryClientContextProvider };
