/**
 * 쿼리 캐시 관리를 위한 파일
 * 이 파일은 쿼리 데이터를 저장하고 관리하는 기능을 제공합니다.
 */
import { QueryClient } from "./query-client.js";
import { Query, QueryState } from "./query.js";
import { hashQueryKeyByOptions } from "./utils.js";

/**
 * 쿼리 캐시 이벤트 타입
 */
export type QueryCacheEvent<TData = unknown> =
  | { type: "added"; query: Query<TData> }
  | { type: "removed"; query: Query<TData> }
  | { type: "updated"; query: Query<TData>; action?: unknown };

/**
 * 쿼리 캐시 리스너 타입
 */
export type QueryCacheListener<TData = unknown> = (event: QueryCacheEvent<TData>) => void;

/**
 * 쿼리 옵션 타입
 */
export interface QueryBuildOptions {
  queryKey: unknown[];
  queryHash?: string;
  // 기타 옵션들
  [key: string]: unknown;
}

/**
 * 쿼리 옵션 타입
 */
export interface QueryOptions {
  queryKey: unknown[];
  queryHash?: string;
  // 기타 옵션들
  [key: string]: unknown;
}

/**
 * 쿼리 저장소 인터페이스
 * 쿼리를 저장, 검색, 삭제하는 기본 메서드를 정의합니다.
 */
export interface QueryStore {
  has: (queryHash: string) => boolean;
  set: <TData = unknown>(queryHash: string, query: Query<TData>) => void;
  get: <TData = unknown>(queryHash: string) => Query<TData> | undefined;
  delete: (queryHash: string) => void;
  values: <TData = unknown>() => IterableIterator<Query<TData>>;
}

/**
 * 쿼리 캐시 클래스
 * 쿼리를 저장하고 관리하는 주요 클래스입니다.
 */
class QueryCache {
  /**
   * 쿼리 맵 - 쿼리 해시를 키로 사용하여 쿼리 객체를 저장합니다.
   */
  private queries: Map<string, Query<unknown>>;

  /**
   * 이벤트 리스너 집합 - 캐시 변경 사항을 구독하는 리스너를 저장합니다.
   */
  protected listeners = new Set<QueryCacheListener<unknown>>();

  /**
   * 생성자
   * 쿼리 맵을 초기화하고 subscribe 메서드를 바인딩합니다.
   */
  constructor() {
    this.queries = new Map<string, Query<unknown>>();

    this.subscribe = this.subscribe.bind(this);
  }

  /**
   * 이벤트 구독 메서드
   * 쿼리 캐시의 변경 사항을 알림 받을 수 있도록 리스너를 등록합니다.
   *
   * @param listener 캐시 변경 시 호출될 리스너 함수
   * @returns 구독 취소 함수
   */
  subscribe(listener: QueryCacheListener): () => void {
    this.listeners.add(listener);

    // this.onSubscribe();

    return () => {
      this.listeners.delete(listener);
      // this.onUnsubscribe();
    };
  }

  /**
   * 쿼리 객체 생성 메서드
   * 주어진 옵션으로 쿼리 객체를 생성하거나 이미 존재하는 경우 반환합니다.
   *
   * @param client 쿼리 클라이언트 인스턴스
   * @param options 쿼리 옵션
   * @returns 생성되거나 이미 존재하는 쿼리 객체
   */
  build<TData = unknown>(
    client: QueryClient,
    options: QueryBuildOptions,
    state?: QueryState<TData>
  ): Query<TData> {
    // 쿼리 키 추출
    const queryKey = options.queryKey;
    // 쿼리 해시 계산 (제공되지 않은 경우)
    const queryHash =
      options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
    // 기존 쿼리 가져오기
    let query = this.get<TData>(queryHash);

    // 쿼리가 존재하지 않으면 새로 생성
    if (!query) {
      // 불가피하게 타입 단언 사용 - 런타임에는 정상이지만 타입 시스템에는 불일치
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config: any = {
        client,
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state,
        defaultOptions: client.getQueryDefaults(queryKey),
      };

      query = new Query<TData>(config);
      this.add(query);
    }

    return query;
  }

  /**
   * 쿼리 조회 메서드
   * 주어진 해시로 쿼리를 조회합니다.
   *
   * @param queryHash 조회할 쿼리의 해시
   * @returns 조회된 쿼리 또는 undefined
   */
  get<TData = unknown>(queryHash: string): Query<TData> | undefined {
    return this.queries.get(queryHash) as Query<TData> | undefined;
  }

  /**
   * 모든 쿼리 조회 메서드
   * 캐시에 저장된 모든 쿼리를 배열로 반환합니다.
   *
   * @returns 모든 쿼리의 배열
   */
  getAll<TData = unknown>(): Query<TData>[] {
    return Array.from(this.queries.values()) as Query<TData>[];
  }

  /**
   * 쿼리 추가 메서드
   * 새로운 쿼리를 캐시에 추가합니다.
   * 이미 존재하는 경우 추가하지 않습니다.
   *
   * @param query 추가할 쿼리 객체
   */
  add<TData = unknown>(query: Query<TData>): void {
    if (!this.queries.has(query.queryHash)) {
      this.queries.set(query.queryHash, query as Query<unknown>);

      // 쿼리 추가 이벤트 발생
      this.notify({
        type: "added",
        query,
      });
    }
  }

  /**
   * 쿼리 제거 메서드
   * 캐시에서 쿼리를 제거합니다.
   *
   * @param query 제거할 쿼리 객체
   */
  remove<TData = unknown>(query: Query<TData>): void {
    // 맵에서 쿼리 조회
    const queryInMap = this.queries.get(query.queryHash);

    if (queryInMap) {
      // 쿼리 리소스 해제
      query.destroy();

      // 맵에 저장된 쿼리와 동일한 객체인 경우에만 삭제
      if (queryInMap === query) {
        this.queries.delete(query.queryHash);
      }

      // 쿼리 제거 이벤트 발생
      this.notify({ type: "removed", query });
    }
  }

  /**
   * 이벤트 알림 메서드
   * 등록된 모든 리스너에게 이벤트를 알립니다.
   *
   * @param event 발생한 이벤트 객체
   */
  notify<TData = unknown>(event: QueryCacheEvent<TData>): void {
    this.listeners.forEach((listener) => {
      listener(event as QueryCacheEvent<unknown>);
    });
  }
}

/**
 * QueryCache 클래스를 내보냅니다.
 * 이 클래스는 쿼리 데이터를 효율적으로 관리하고 캐싱하는 데 사용됩니다.
 */
export { QueryCache };
