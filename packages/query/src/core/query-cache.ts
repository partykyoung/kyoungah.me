/*
  QueryCache
  - Query 인스턴스들을 저장하고 관리하는 저장소.
  - 쿼리를 생성(build), 삭제(remove), 검색(find)할 수 있다.
  - Query 상태가 변경되었을 때 등록된 리스너들에게 알림(notification)을 전달한다.
 */

import {
  Query,
  type QueryClientType,
  type QueryOptions,
  type QueryState,
} from "./query.js";
import { hashQueryKeyByOptions } from "./utils.js";

class QueryCache {
  private queries: Map<string, Query<unknown>>;
  private listeners: Set<() => void>;

  constructor() {
    this.queries = new Map();
    this.listeners = new Set();
  }

  protected subscribe = (listener: () => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  add = <TData = unknown>(query: Query<TData>) => {
    if (!this.queries.has(query.queryHash)) {
      // 타입 단언을 안전하게 변경
      this.queries.set(query.queryHash, query as unknown as Query<unknown>);

      this.notify();
    }
  };

  get = (queryHash: string) => {
    return this.queries.get(queryHash);
  };

  getAll = () => {
    return Array.from(this.queries.values());
  };

  build = <TData = unknown>(
    client: QueryClientType,
    options: QueryOptions<TData>,
    state?: QueryState<TData>
  ) => {
    const queryKey = options.queryKey || [];
    const queryHash =
      options.queryHash ?? hashQueryKeyByOptions(queryKey, options);

    let query = this.get(queryHash) as Query<TData> | undefined;

    if (query === undefined) {
      query = new Query<TData>({
        client,
        queryKey,
        queryHash,
        state,
        defaultOptions: client.getQueryDefaults(
          queryKey
        ) as QueryOptions<TData>,
        options: client.defaultQueryOptions(options),
      });

      this.add(query);
    }

    return query as Query<TData>;
  };

  remove<TData = unknown>(query: Query<TData>): void {
    // 맵에서 쿼리 조회
    const queryInMap = this.queries.get(query.queryHash);

    if (queryInMap) {
      // 맵에 저장된 쿼리와 동일한 객체인 경우에만 삭제
      if (queryInMap === query) {
        this.queries.delete(query.queryHash);
      }

      // 쿼리 제거 이벤트 발생
      this.notify();
    }
  }

  notify = () => {
    this.listeners.forEach((callback: () => void) => {
      callback();
    });
  };
}

export { QueryCache };
