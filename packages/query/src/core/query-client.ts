import { QueryCache } from "./query-cache.js";
import { hashQueryKeyByOptions, partialMatchKey, skipToken } from "./utils.js";

/**
 * QueryClient 설정 인터페이스
 */
interface QueryClientConfig {
  queryCache?: QueryCache;
  defaultOptions?: {
    queries?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

/**
 * 쿼리 기본 옵션 인터페이스
 */
interface QueryDefaults {
  queryKey: unknown[];
  defaultOptions: Record<string, unknown>;
}

// 쿼리 옵션 타입 정의
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

/**
 * QueryClient는 쿼리 상태를 관리하고 쿼리 캐시와 상호작용하는 클라이언트 클래스입니다.
 * 이 클래스는 쿼리 데이터를 조회하고, 상태를 확인하며, 기본 옵션을 설정하는 역할을 합니다.
 * 쿼리 캐시를 중앙에서 관리하고 다양한 쿼리 작업을 수행하는 주요 인터페이스를 제공합니다.
 */
class QueryClient {
  /** 쿼리 결과를 저장하고 관리하는 캐시 인스턴스 */
  private queryCache: QueryCache;
  /** 모든 쿼리에 적용될 기본 옵션 */
  private defaultOptions: {
    queries?: Record<string, unknown>;
    [key: string]: unknown;
  };
  /** 특정 쿼리 키에 대한 기본 옵션을 저장하는 맵 - 특정 패턴의 쿼리에 커스텀 기본값 적용 가능 */
  private queryDefaults: Map<string, QueryDefaults>;

  /**
   * QueryClient 생성자
   * QueryClient 인스턴스를 초기화하고 설정합니다.
   *
   * @param config 클라이언트 설정 객체
   * @param config.queryCache 사용자 정의 QueryCache 인스턴스 (선택 사항)
   * @param config.defaultOptions 모든 쿼리와 뮤테이션에 적용될 기본 옵션 (선택 사항)
   *
   * @example
   * // 기본 설정으로 클라이언트 생성
   * const queryClient = new QueryClient();
   *
   * // 커스텀 설정으로 클라이언트 생성
   * const queryClient = new QueryClient({
   *   defaultOptions: {
   *     queries: {
   *       staleTime: 1000 * 60 * 5, // 5분
   *       retry: 3,
   *     }
   *   }
   * });
   */
  constructor(config: QueryClientConfig = {}) {
    this.queryCache = config.queryCache || new QueryCache();
    this.defaultOptions = config.defaultOptions || {};
    this.queryDefaults = new Map();
  }

  /**
   * 쿼리 옵션에 기본값을 적용합니다.
   * 이 메서드는 다양한 소스의 설정을 병합하여 최종 쿼리 옵션을 생성합니다:
   * 1. 글로벌 기본 옵션 (생성자에서 설정)
   * 2. 특정 쿼리 키에 대한 기본 옵션
   * 3. 직접 제공된 쿼리 옵션
   *
   * 또한 필수 값이 없는 경우 자동으로 생성하고, 의존적인 옵션들을 처리합니다.
   *
   * @param options 원본 쿼리 옵션
   * @returns 모든 기본값이 적용되고 필요한 값이 계산된 최종 쿼리 옵션
   */
  defaultQueryOptions(options: Record<string, unknown>): DefaultedQueryOptions {
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

    if (!defaultedOptions.queryHash && defaultedOptions.queryKey) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(
        defaultedOptions.queryKey as unknown[],
        defaultedOptions
      );
    }

    // 의존적인 기본값 설정
    if (defaultedOptions.refetchOnReconnect === undefined) {
      // 네트워크 모드가 'always'가 아닐 경우에만 재연결 시 데이터 갱신
      defaultedOptions.refetchOnReconnect =
        defaultedOptions.networkMode !== "always";
    }
    if (defaultedOptions.throwOnError === undefined) {
      // suspense 모드가 활성화된 경우 자동으로 에러 발생 시 throw 설정
      defaultedOptions.throwOnError = !!defaultedOptions.suspense;
    }

    if (!defaultedOptions.networkMode && defaultedOptions.persister) {
      // 지속성(persistence) 기능이 사용될 경우 기본 네트워크 모드를 'offlineFirst'로 설정
      defaultedOptions.networkMode = "offlineFirst";
    }

    if (defaultedOptions.queryFn === skipToken) {
      // skipToken이 사용된 경우 쿼리 비활성화
      defaultedOptions.enabled = false;
    }

    return defaultedOptions;
  }

  getQueryCache(): QueryCache {
    return this.queryCache;
  }

  /**
   * 특정 쿼리 키에 대한 기본 옵션을 가져옵니다.
   * 쿼리 키와 부분적으로 일치하는 모든 기본 설정을 찾아 병합합니다.
   * 이는 특정 API 엔드포인트나 데이터 유형에 대한 일관된 설정을 유지하는 데 유용합니다.
   *
   * @param queryKey 쿼리 키 - 문자열, 배열 또는 다른 직렬화 가능한 값
   * @returns 해당 쿼리 키와 일치하는 모든 기본 옵션의 병합 결과
   */
  getQueryDefaults(queryKey?: unknown[]): Record<string, unknown> {
    // 쿼리 키가 없으면 빈 객체 반환
    if (!queryKey) {
      return {};
    }

    // 모든 등록된 기본 옵션을 배열로 변환
    const defaults = Array.from(this.queryDefaults.values());

    const result: Record<string, unknown> = {};

    // 쿼리 키와 부분적으로 일치하는 모든 기본 옵션을 병합
    // partialMatchKey 함수는 쿼리 키의 부분 일치를 확인합니다.
    // 예: ['posts']는 ['posts', 1]와 부분 일치합니다.
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });

    return result;
  }

  /**
   * 특정 쿼리 키에 해당하는 데이터를 조회합니다.
   * 캐시에서 직접 데이터를 가져오므로 네트워크 요청을 발생시키지 않습니다.
   *
   * @param queryKey 조회할 쿼리 키 - 해당 쿼리를 식별하는 고유한 값
   * @returns 해당 쿼리의 데이터 또는 캐시에 데이터가 없는 경우 undefined
   * @example
   * // posts/1에 대한 캐시된 데이터 가져오기
   * const post = queryClient.getQueryData(['posts', 1]);
   */
  getQueryData<TData = unknown>(queryKey: unknown[]): TData | undefined {
    // 쿼리 키를 기반으로 기본 옵션을 적용
    const options = this.defaultQueryOptions({ queryKey });

    // 쿼리 해시로 캐시에서 데이터 접근
    const queryHash = options.queryHash as string;
    const query = this.queryCache.get<TData>(queryHash);
    return query?.state.data;
  }

  /**
   * 특정 쿼리 키에 해당하는 상태를 조회합니다.
   * 상태에는 데이터뿐만 아니라 로딩 상태, 에러, 마지막 업데이트 시간 등 추가 정보가 포함됩니다.
   *
   * @param queryKey 조회할 쿼리 키 - 해당 쿼리를 식별하는 고유한 값
   * @returns 해당 쿼리의 전체 상태 객체 (data, error, status, fetchStatus 등)
   * @example
   * // posts/1의 상태 확인 (로딩 중인지, 에러가 있는지 등)
   * const { status, data, error } = queryClient.getQueryState(['posts', 1]);
   */
  getQueryState<TData = unknown>(queryKey: unknown[]) {
    // 쿼리 키를 기반으로 기본 옵션을 적용
    const options = this.defaultQueryOptions({ queryKey });

    // 쿼리 해시로 캐시에서 전체 상태 정보 접근
    const queryHash = options.queryHash as string;
    return this.queryCache.get<TData>(queryHash)?.state;
  }
}

export { QueryClient };
