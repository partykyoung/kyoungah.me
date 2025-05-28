import { useCallback, useState, useSyncExternalStore } from "react";
import { useQueryClient, ExtendedQueryClient } from "./query-client-context.js";
import { QueryObserver } from "../core/query-observer.js";
import type {
  QueryState,
  QueryOptions as BaseQueryOptions,
} from "../core/query.js";

/**
 * 쿼리 옵션 타입
 */
export interface QueryOptions<TData = unknown> extends BaseQueryOptions<TData> {
  queryKey: unknown[];
  queryFn?: () => Promise<TData>;
  staleTime?: number;
  enabled?: boolean;
}

/**
 * 쿼리 결과 타입 - QueryState를 확장하여 추가 헬퍼 메서드 제공
 */
export interface QueryResult<TData = unknown> extends QueryState<TData> {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isFetching: boolean;
}

/**
 * Observer 생성자 타입
 */
interface ObserverConstructor<TData> {
  new (
    client: ExtendedQueryClient,
    options: QueryOptions<TData>
  ): {
    subscribe: (callback: () => void) => () => void;
    getResult: () => QueryState<TData>;
  };
}

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
): QueryResult<TData> {
  // 클라이언트 가져오기
  const client = useQueryClient(queryClient);

  // Observer 인스턴스 생성
  const [observer] = useState(() => {
    // 기본 옵션 적용
    const defaultOptions = client.defaultQueryOptions(options);
    return new Observer(client, defaultOptions as QueryOptions<TData>);
  });

  // 구독 함수
  const subscribe = useCallback(
    (onStoreChange: () => void) => observer.subscribe(onStoreChange),
    [observer]
  );

  // 현재 상태 가져오기
  const getSnapshot = useCallback(() => observer.getResult(), [observer]);

  // 외부 스토어와 동기화
  useSyncExternalStore(subscribe, getSnapshot);

  // 쿼리 상태 가져오기
  const state = observer.getResult();

  // 결과 반환 (편의 헬퍼 속성 포함)
  return {
    ...state,
    isLoading: state.status === "pending",
    isError: state.status === "error",
    isSuccess: state.status === "success",
    isFetching: state.fetchStatus === "fetching",
  };
}

/**
 * 데이터를 조회하는 훅입니다.
 *
 * @param options 쿼리 옵션
 * @param queryClient 선택적으로 제공할 QueryClient 인스턴스
 * @returns 쿼리 결과 및 상태
 */
function useQuery<TData = unknown>(
  options: QueryOptions<TData>,
  queryClient?: ExtendedQueryClient
): QueryResult<TData> {
  return useBaseQuery<TData>(
    options,
    QueryObserver as unknown as ObserverConstructor<TData>,
    queryClient
  );
}

export { useQuery };
