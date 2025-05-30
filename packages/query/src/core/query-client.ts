/*
  QueryClient
  - 모든 쿼리를 관리하는 중앙 클라이언트.
  - 생성 시 QueryCache를 초기화하여 this.queryCache에 저장한다.
  - 쿼리를 생성할 때 defaultOptions를 바탕으로 쿼리 기본 동작을 구성한다.
  - getQueryData, setQueryData, invalidateQueries 등의 API를 통해 쿼리 접근 및 갱신을 제공한다.
    - 여기서는 getQueryData, getQueryState만 구현한다.
*/

import { QueryCache } from "./query-cache.js";

import { hashQueryKeyByOptions, type QueryFilters } from "./utils.js";

interface QueryDefaults {
  queryKey: unknown[];
  defaultOptions: Record<string, unknown>;
}

interface QueryClientConfig {
  queryCache?: QueryCache;
  defaultOptions?: {
    queries?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

interface DefaultedQueryOptions extends Record<string, unknown> {
  _defaulted: boolean;
  queryKey?: unknown[];
  queryHash?: string;
  queryFn?: unknown;
  refetchOnReconnect?: boolean;
  networkMode?: string;
  throwOnError?: boolean;
  suspense?: boolean;
  persister?: unknown;
  enabled?: boolean;
}

class QueryClient {
  private queryCache: QueryCache;

  /*
    모든 쿼리에 적용될 기본 옵션을 저장한다.
    defaultQueryOptions 값은 QueryClient 인스턴스를 생성하는 시점에 전달할 수 있다. 
    defaultQueryOptions 옵션을 통해 Query 객체를 생성할 때 중복되는 코드 영역을 선언하지 않아도 된다.
  */
  private defaultOptions: {
    queries?: Record<string, unknown>;
    [key: string]: unknown;
  };

  /*
    특정 쿼리 키에 대한 기본 옵션을 저장하는 맵. 
    특정 패턴의 쿼리에 커스텀 기본값을 적용할 수 있다. 
  */
  private queryDefaults: Map<string, QueryDefaults>;

  constructor(config: QueryClientConfig = {}) {
    this.queryCache = config.queryCache || new QueryCache();
    this.defaultOptions = config.defaultOptions || {};
    this.queryDefaults = new Map();
  }

  defaultQueryOptions = (options: Partial<DefaultedQueryOptions>) => {
    if (options._defaulted) {
      return options as DefaultedQueryOptions;
    }

    const queryKey = options.queryKey as unknown[] | undefined;

    const defaultedOptions: DefaultedQueryOptions = {
      ...(this.defaultOptions.queries || {}),
      ...this.getQueryDefaults(queryKey),
      ...options,
      _defaulted: true,
    };

    // 쿼리 해시가 없고 쿼리 키가 있는 경우 해시를 생성한다.
    if (!defaultedOptions.queryHash && defaultedOptions.queryKey) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(
        defaultedOptions.queryKey as unknown[],
        defaultedOptions
      );
    }

    return defaultedOptions;
  };

  getQueryCache = () => {
    return this.queryCache;
  };

  getQueryDefaults = (queryKey?: unknown[]): Record<string, unknown> => {
    if (!queryKey) {
      return {};
    }

    const keyHash = hashQueryKeyByOptions(queryKey);
    const queryDefaults = this.queryDefaults.get(keyHash);

    return queryDefaults?.defaultOptions ?? {};
  };

  /**
   * 특정 쿼리 키에 해당하는 데이터를 조회한다.
   * 캐시에서 직접 데이터를 가져오므로 네트워크 요청을 발생시키지 않는다.
   *
   * @param queryKey 조회할 쿼리 키 - 해당 쿼리를 식별하는 고유한 값
   * @returns 해당 쿼리의 데이터 또는 캐시에 데이터가 없는 경우 undefined
   */
  getQueryData = (queryKey: unknown[]) => {
    // 쿼리 키를 기반으로 기본 옵션을 적용한다.
    const options = this.defaultQueryOptions({ queryKey });

    // 쿼리 해시로 캐시에서 데이터에 접근한다.
    const queryHash = options.queryHash as string;
    const query = this.queryCache.get(queryHash);
    return query?.state.data;
  };

  /**
   * 특정 쿼리 키에 해당하는 상태를 조회한다.
   * 상태에는 데이터뿐만 아니라 로딩 상태, 에러, 마지막 업데이트 시간 등 추가 정보가 포함된다.
   *
   * @param queryKey 조회할 쿼리 키 - 해당 쿼리를 식별하는 고유한 값
   * @returns 해당 쿼리의 전체 상태 객체 (data, error, status, fetchStatus 등)
   */
  getQueryState = (queryKey: unknown[]) => {
    // 쿼리 키를 기반으로 기본 옵션을 적용한다.
    const options = this.defaultQueryOptions({ queryKey });

    // 쿼리 해시로 캐시에서 전체 상태 정보에 접근한다.
    const queryHash = options.queryHash as string;
    return this.queryCache.get(queryHash)?.state;
  };

  getQueriesData = <TData = unknown>(filters: QueryFilters) => {
    return this.queryCache.findAll(filters).map(({ queryKey, state }) => {
      const data = state.data as TData | undefined;
      return [queryKey, data] as const;
    });
  };
}

export { QueryClient };
