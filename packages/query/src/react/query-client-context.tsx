"use client";

import { useEffect, useContext, createContext, ReactNode } from "react";
import { QueryClient } from "../core/query-client.js";

// QueryClient에 mount, unmount 메서드를 포함한 확장 타입 정의
export interface ExtendedQueryClient extends QueryClient {
  mount?: () => void;
  unmount?: () => void;
}

export const QueryClientContext = createContext<
  ExtendedQueryClient | undefined
>(undefined);

/**
 * QueryClient를 가져오는 훅
 * 직접 QueryClient를 제공하거나 Context에서 가져옵니다.
 *
 * @param queryClient 선택적으로 직접 제공하는 QueryClient 인스턴스
 * @returns QueryClient 인스턴스
 */
function useQueryClient(
  queryClient?: ExtendedQueryClient
): ExtendedQueryClient {
  const client = useContext(QueryClientContext);

  if (queryClient) {
    return queryClient;
  }

  if (client === undefined || client === null) {
    throw new Error(
      "No QueryClient set, use QueryClientContextProvider to set one."
    );
  }

  return client;
}

/**
 * QueryClient를 React Context로 제공하는 컴포넌트
 */
interface QueryClientContextProviderProps {
  client: ExtendedQueryClient;
  children: ReactNode;
}

function QueryClientContextProvider({
  client,
  children,
}: QueryClientContextProviderProps) {
  useEffect(() => {
    // client의 mount와 unmount 메서드가 있는 경우에만 호출
    if (client.mount) {
      client.mount();
    }

    return () => {
      if (client.unmount) {
        client.unmount();
      }
    };
  }, [client]);

  return (
    <QueryClientContext.Provider value={client}>
      {children}
    </QueryClientContext.Provider>
  );
}

export { useQueryClient, QueryClientContextProvider };
