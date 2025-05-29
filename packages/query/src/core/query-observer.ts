import type { QueryState, QueryOptions as BaseQueryOptions } from "./query.js";
import { resolveEnabled, resolveStaleTime } from "./utils.js";

// QueryClient 타입
type QueryClientType = {
  getQueryCache: () => {
    build: <TData = unknown>(
      client: QueryClientType,
      options: QueryOptionsType<TData>
    ) => Query<TData>;
    remove: <TData = unknown>(query: Query<TData>) => void;
    notify: <TData = unknown>(event: {
      query: Query<TData>;
      type: string;
      action?: unknown;
    }) => void;
  };
  defaultQueryOptions: <TData = unknown>(
    options: QueryOptionsType<TData>
  ) => QueryOptionsType<TData>;
};

// Query 인터페이스
interface Query<TData = unknown> {
  state: QueryState<TData>;
  queryKey: unknown;
  queryHash: string;
  options: QueryOptionsType<TData>;
  observers: QueryObserver<TData>[];
  subscribe: (observer: QueryObserver<TData>) => () => void;
  fetch: () => Promise<TData>;
  addObserver: (observer: QueryObserver<TData>) => void;
  removeObserver: (observer: QueryObserver<TData>) => void;
  isStaleByTime: (staleTime?: number) => boolean;
}

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

function noop() {}

// 핵심 옵저버 클래스
class QueryObserver<TData = unknown> {
  private client: QueryClientType;
  private options: QueryOptionsType<TData>;
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
    const unsubscribeQuery = query.subscribe(this);

    // 마지막 업데이트 시간이 없거나 staleTime보다 오래되었으면 다시 가져옴
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
