/* 
  QueryObserver
  - 특정 쿼리에 대한 구독자 역할.
    - 하나의 Query를 구독한다.
    - queryKey 값을 기반으로 구독할 Query 객체를 결정하며 Query의 상태가 변경될 때 마다 새로운 상태를 전달 받는다.
  - QueryClient와 연결되어 있으며, 필요한 쿼리를 QueryCache에서 가져온다.
  - 구독 시 Query에 옵저버로 등록되어 쿼리 상태 변경 시 콜백을 통해 알림을 받는다.
  - 여러 컴포넌트에서 동일한 key로 쿼리를 구독할 경우, 동일한 Query 인스턴스를 공유하고 각자 QueryObserver가 연결된다.
    - 이미 fetch()가 진행된 경우 중복 요청 없이 캐시된 데이터를 이용하거나, 진행 중인 요청을 공유한다.
*/

import type { QueryOptions as BaseQueryOptions, Query } from "./query.js";
import {
  resolveEnabled,
  resolveStaleTime,
  shallowEqualObjects,
} from "./utils.js";

type QueryClientType = {
  getQueryCache: () => {
    build: <TData = unknown>(
      client: QueryClientType,
      options: QueryOptionsType<TData>
    ) => Query<TData>;
    remove: <TData = unknown>(query: Query<TData>) => void;
    notify: () => void;
  };
  defaultQueryOptions: <TData = unknown>(
    options: QueryOptionsType<TData>
  ) => QueryOptionsType<TData>;
};

// 옵션 타입
type QueryOptionsType<TData = unknown> = BaseQueryOptions<TData> & {
  staleTime?: number;
  enabled?: boolean;
  _defaulted?: boolean;
};

function isStale<TData = unknown>(
  query: Query<TData>,
  options: QueryOptionsType<TData>
): boolean {
  return (
    resolveEnabled(options.enabled, query) !== false &&
    query.isStaleByTime(resolveStaleTime(options.staleTime, query))
  );
}

function shouldFetchOptionally<TData = unknown>(
  query: Query<TData>,
  prevQuery: Query<TData> | undefined,
  options: QueryOptionsType<TData>,
  prevOptions: QueryOptionsType<TData>
): boolean {
  return (
    (query !== prevQuery ||
      resolveEnabled(prevOptions.enabled, query) === false) &&
    (!options.suspense || query.state.status !== "error") &&
    isStale(query, options)
  );
}

function noop() {}

// 핵심 옵저버 클래스
class QueryObserver<TData = unknown> {
  private currentQuery!: Query<TData>; // 확정 할당 어설션 사용
  private client: QueryClientType;
  // Query.ts에서 정의된 QueryObserver 인터페이스와 호환되도록 options를 public으로 변경
  public options: QueryOptionsType<TData>;
  private notifyCallback = noop;

  /**
   * QueryObserver 생성자
   * @param client - 쿼리 클라이언트 인스턴스
   * @param options - 쿼리 옵션
   */
  constructor(client: QueryClientType, options?: QueryOptionsType<TData>) {
    this.client = client;
    this.options = options ?? ({} as QueryOptionsType<TData>);
  }

  updateQuery = () => {
    const query = this.client.getQueryCache().build(this.client, this.options);

    if (query === this.currentQuery) {
      return;
    }

    this.currentQuery = query;

    // 타입 호환성을 위해 타입 단언 사용
    query.subscribe(this as unknown as QueryObserver);
  };

  setOptions = (options: QueryOptionsType<TData>) => {
    const prevOptions = this.options;
    const prevQuery = this.currentQuery;

    this.options = this.client.defaultQueryOptions(options);

    this.updateQuery();
    this.currentQuery.setOptions(this.options);

    if (
      prevOptions._defaulted &&
      !shallowEqualObjects(this.options, prevOptions)
    ) {
      this.client.getQueryCache().notify();
    }

    if (
      shouldFetchOptionally(
        this.currentQuery,
        prevQuery,
        this.options,
        prevOptions
      )
    ) {
      this.currentQuery.fetch();
    }

    this.onQueryUpdate();
  };

  /**
   * 쿼리 업데이트 시 호출되는 메서드
   * query.ts에서 사용하기 위한 필수 구현
   */
  onQueryUpdate(): void {
    this.notify();
  }

  /**
   * 상태 변경 시 등록된 콜백 함수를 호출하는 메서드
   * query.ts에서 직접 호출하는 public 메서드
   */
  notify(): void {
    this.notifyCallback();
  }

  /**
   * 현재 쿼리 인스턴스를 가져옴
   * 클라이언트의 쿼리 캐시를 통해 쿼리를 생성하거나 기존 쿼리를 반환
   * @returns 쿼리 인스턴스
   */
  getQuery = (): Query<TData> => {
    const defaultedOptions = this.client.defaultQueryOptions<TData>(
      this.options
    );

    const query = this.client
      .getQueryCache()
      .build<TData>(this.client, defaultedOptions);

    return query;
  };

  getResult() {
    return this.getQuery().state;
  }

  subscribe = (callback: () => void) => {
    this.notifyCallback = callback;

    const query = this.getQuery();
    // 타입 호환성을 위해 타입 단언 사용
    const unsubscribeQuery = query.subscribe(this as unknown as QueryObserver);

    /* 
      마지막 업데이트 시간이 없거나 staleTime이 지났으면 오래되었으면 다시 가져온다.
      - fresh: 신선한 상태 -> 쿼리 데이터가 최신 상태로 유지되는 시간
      - stale: 신선하지 않은 상태 -> 쿼리 데이터가 오래되어 다시 가져와야 하는 상태
    */
    const needsToFetch = isStale(query, this.options);

    if (needsToFetch) {
      query.fetch();
    }

    const unsubscribe = () => {
      unsubscribeQuery();
      this.notifyCallback = noop;
    };

    return unsubscribe;
  };
}

export { QueryObserver };
