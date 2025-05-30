/*
  QueryCache
  - Query 인스턴스들을 저장하고 관리하는 저장소.
  - 쿼리를 생성(build), 삭제(remove), 검색(find)할 수 있다.
  - Query 객체의 인스턴스를 브라우저 메모리에 저장하여 캐싱을 구현한다.
  - Query 상태가 변경되었을 때 등록된 리스너들에게 알림(notification)을 전달한다.
 */

import {
  Query,
  type QueryClientType,
  type QueryOptions,
  type QueryState,
} from "./query.js";
import {
  hashQueryKeyByOptions,
  matchQuery,
  type QueryFilters,
} from "./utils.js";

class QueryCache {
  // queries 변수를 사용해 메모리에 캐시 데이터를 저장한다.
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
    if (this.queries.has(query.queryHash) === false) {
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

  find = (filters: QueryFilters) => {
    const defaultedFilters = { exact: true, ...filters };

    return this.getAll().find((query) =>
      matchQuery(
        defaultedFilters,
        query as unknown as import("./utils.js").Query
      )
    );
  };

  findAll = (filters: QueryFilters = {}) => {
    const queries = this.getAll();
    return Object.keys(filters).length > 0
      ? queries.filter((query) =>
          matchQuery(filters, query as unknown as import("./utils.js").Query)
        )
      : queries;
  };

  /**
   * 쿼리 인스턴스를 생성하거나 기존 인스턴스를 반환한다.
   * @param client
   * @param options
   * @param state
   * @returns
   */
  build = <TData = unknown>(
    client: QueryClientType,
    options: QueryOptions<TData>,
    state?: QueryState<TData>
  ) => {
    const queryKey = options.queryKey || [];
    const queryHash =
      options.queryHash ?? hashQueryKeyByOptions(queryKey, options);

    /*
      만약 queries에 Query가 캐싱되어 있는 경우, 캐싱된 Query 인스턴스를 반환한다.
      Query 인스턴스가 없는 경우, 새로운 Query 인스턴스를 생성하고 캐싱한 후 반환한다.
    */

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
