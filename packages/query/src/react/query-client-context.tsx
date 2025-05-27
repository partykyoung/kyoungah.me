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
      "QueryClient가 설정되지 않았습니다. QueryClientContextProvider를 사용하여 설정해주세요."
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
