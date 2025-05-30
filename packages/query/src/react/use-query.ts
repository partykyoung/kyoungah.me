import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
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
 * 쿼리 훅의 기본 구현입니다. 다양한 쿼리 훅에서 재사용할 수 있습니다.
 *
 * @param options 쿼리 옵션
 * @param Observer 사용할 Observer 클래스
 * @param queryClient 선택적으로 제공할 QueryClient 인스턴스
 * @returns 쿼리 결과
 */
function useBaseQuery<TData = unknown>(
  options: QueryOptions<TData>,
  Observer: {
    new <T = TData>(
      client: ExtendedQueryClient,
      options: QueryOptions<T>
    ): QueryObserver<T>;
  },
  queryClient?: ExtendedQueryClient
): QueryResult<TData> {
  // 클라이언트 가져오기
  const client = useQueryClient(queryClient);
  const defaultedOptions = client.defaultQueryOptions(
    options
  ) as QueryOptions<TData>;

  // Observer 인스턴스 생성
  const [observer] = useState(() => {
    return new Observer(client, defaultedOptions);
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

  useEffect(() => {
    observer.setOptions(
      defaultedOptions as unknown as Parameters<typeof observer.setOptions>[0]
    );
  }, [defaultedOptions, observer]);

  // 외부 스토어와 동기화 (getServerSnapshot 추가)
  // 서버 스냅샷은 클라이언트 스냅샷과 동일한 초기 상태를 사용
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Observer의 getResult 메서드를 호출하여 현재 상태를 가져옴
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
  // 타입 호환성 문제를 해결하기 위해 타입 단언(type assertion) 사용
  const TypedQueryObserver = QueryObserver as unknown as {
    new <T>(
      client: ExtendedQueryClient,
      options: QueryOptions<T>
    ): QueryObserver<T>;
  };
  return useBaseQuery<TData>(options, TypedQueryObserver, queryClient);
}

export { useQuery };
