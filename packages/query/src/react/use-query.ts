import { useCallback, useState, useSyncExternalStore } from "react";
import {
  useQueryClient,
  ExtendedQueryClient,
} from "./query-client-context.jsx";
import { QueryObserver } from "../core/query-observer.js";
import type { QueryState } from "../core/query.js";

/**
 * 쿼리 옵션 타입
 */
type QueryOptions<TData = unknown> = {
  queryKey: unknown[];
  queryFn?: () => Promise<TData>;
  staleTime?: number;
  [key: string]: unknown;
};

/**
 * Observer 생성자 타입
 */
type ObserverConstructor<TData> = {
  new (
    client: unknown,
    options: unknown
  ): {
    subscribe: (callback: () => void) => () => void;
    getResult: () => QueryState<TData>;
  };
};

/**
 * 쿼리 훅의 기본 구현입니다. 다양한 쿼리 훅에서 재사용할 수 있습니다.
 *
 * @param options 쿼리 옵션
 * @param Observer 사용할 Observer 클래스
 * @param queryClient 선택적으로 제공할 QueryClient 인스턴스
 * @returns 쿼리 결과
 */
function useBaseQuery<TData = unknown>(
  options: QueryOptions<TData>,
  Observer: ObserverConstructor<TData>,
  queryClient?: ExtendedQueryClient
): QueryState<TData> {
  // 클라이언트 가져오기
  const client = useQueryClient(queryClient);

  // Observer 인스턴스 생성
  const [observer] = useState(() => {
    // 기본 옵션 적용
    const defaultOptions = client.defaultQueryOptions(options);
    // Observer 생성 (타입 단언으로 타입 호환성 문제 해결)
    return new Observer(client as unknown, defaultOptions);
  });

  // 구독 함수
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const unsubscribe = observer.subscribe(onStoreChange);
      return unsubscribe;
    },
    [observer]
  );

  // 현재 상태 가져오기
  const getSnapshot = useCallback(() => {
    return observer.getResult();
  }, [observer]);

  // 외부 스토어와 동기화
  useSyncExternalStore(subscribe, getSnapshot);

  // 결과 반환
  return observer.getResult();
}

/**
 * 데이터를 조회하는 훅입니다.
 *
 * @param options 쿼리 옵션
 * @param queryClient 선택적으로 제공할 QueryClient 인스턴스
 * @returns 쿼리 결과
 */
function useQuery<TData = unknown>(
  options: QueryOptions<TData>,
  queryClient?: ExtendedQueryClient
): QueryState<TData> {
  return useBaseQuery<TData>(
    options,
    QueryObserver as unknown as ObserverConstructor<TData>,
    queryClient
  );
}

export { useQuery };
