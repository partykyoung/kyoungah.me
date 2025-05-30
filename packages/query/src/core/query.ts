/*
  Query
  - 단일 쿼리를 표현하는 객체.
  - 데이터 상태(data) 와 요청 상태(status, error 등)를 관리한다.
  - fetch 함수와 옵션을 갖고 있으며, fetch()를 통해 비동기 데이터를 가져온다.
  - 내부적으로 요청 deduplication (중복 요청 제거) 로직을 포함한다.
  - 동일한 쿼리가 요청 중이면 동일한 Promise를 공유한다.
*/

import { isValidTimeout, resolveEnabled, timeUntilStale } from "./utils.js";
import type { QueryCache } from "./query-cache.js";

// 쿼리 상태 타입 정의
export interface QueryState<TData = unknown> {
  data: TData | undefined;
  dataUpdatedAt: number;
  error: Error | null;
  status: "success" | "error" | "pending";
  fetchStatus: "idle" | "fetching" | "paused";
}

// 쿼리 구성 타입 정의
export interface QueryConfig<TData = unknown> {
  defaultOptions?: QueryOptions<TData>;
  options: QueryOptions<TData>;
  client: QueryClientType;
  queryKey: unknown[];
  queryHash: string;
  state?: QueryState<TData>;
}

// 쿼리 클라이언트 타입 정의 (간소화)
export interface QueryClientType {
  getQueryCache: () => QueryCache;
  defaultQueryOptions: <T>(options: QueryOptions<T>) => QueryOptions<T>;
  getQueryDefaults: (queryKey: unknown[]) => QueryOptions<unknown>;
}

// 쿼리 옵션 타입 정의
export interface QueryOptions<TData = unknown> {
  queryKey?: unknown[];
  queryHash?: string;
  queryFn?: () => Promise<TData>;
  initialData?: TData | (() => TData);
  initialDataUpdatedAt?: number | (() => number | undefined);
  gcTime?: number;
  [key: string]: unknown;
}

// 쿼리 옵저버 타입 정의 (간소화)
export interface QueryObserver {
  onQueryUpdate: () => void;
  notify: () => void;
  options: {
    enabled?: boolean | (() => boolean);
    [key: string]: unknown;
  };
}

function getDefaultState<TData>(
  options: QueryOptions<TData>
): QueryState<TData> {
  const data =
    typeof options.initialData === "function"
      ? (options.initialData as () => TData)()
      : options.initialData;

  const hasData = data !== undefined;

  const initialDataUpdatedAt = hasData
    ? typeof options.initialDataUpdatedAt === "function"
      ? (options.initialDataUpdatedAt as () => number | undefined)()
      : options.initialDataUpdatedAt
    : 0;

  return {
    data,
    dataUpdatedAt: hasData ? (initialDataUpdatedAt ?? Date.now()) : 0,
    error: null,
    status: hasData ? "success" : "pending",
    fetchStatus: "idle",
  };
}

// 쿼리 액션 타입 정의
type QueryAction<TData = unknown> =
  | { type: "failed"; error: Error }
  | { type: "pause" }
  | { type: "continue" }
  | { type: "fetch" }
  | { type: "success"; data: TData; dataUpdatedAt?: number }
  | { type: "error"; error: Error }
  | {
      type: "setState";
      state: Partial<QueryState<TData>>;
      setStateOptions?: Record<string, unknown>;
    };

class Query<TData = unknown> {
  readonly queryKey: unknown[];
  readonly queryHash: string;

  // QueryCache에서 캐싱되어 있는 Query를 제거하지 않는 시간.
  private gcTime: number;
  private gcTimeout?: ReturnType<typeof setTimeout>;

  private options!: QueryOptions<TData>; // definite assignment assertion
  state: QueryState<TData>;

  private initialState: QueryState<TData>;
  private cache: QueryCache;
  private client: QueryClientType;
  private observers: QueryObserver[];
  private defaultOptions?: QueryOptions<TData>;
  private promise: Promise<TData | undefined> | null;

  constructor(config: QueryConfig<TData>) {
    this.client = config.client;
    this.cache = this.client.getQueryCache();
    this.defaultOptions = config.defaultOptions;
    this.gcTime = 1000 * 60 * 5;
    this.queryHash = config.queryHash;
    this.queryKey = config.queryKey;
    this.options = { ...this.defaultOptions, ...config.options };
    this.initialState = getDefaultState(this.options);
    this.state = config.state ?? this.initialState;
    this.observers = [];
    this.promise = null;

    this.setOptions(config.options);
    this.scheduleGc();
  }

  protected optionalRemove = () => {
    if (this.observers.length === 0 && this.state.fetchStatus === "idle") {
      this.cache.remove(this);
    }
  };

  protected scheduleGc = () => {
    // Query에 구독이 발생될 때 마다 gcTimeout을 초기화한다.
    this.clearGcTimeout();

    /*
      Query가 생성되는 시점에 setTimeout을 설정한다.
      gcTime timeout이 호출되면 QueryCache에게 제거를 요청한다.
    */

    if (isValidTimeout(this.gcTime)) {
      this.gcTimeout = setTimeout(() => {
        this.optionalRemove();
      }, this.gcTime);
    }
  };

  protected updateGcTime(newGcTime: number | undefined): void {
    this.gcTime = Math.max(
      this.gcTime || 0,
      newGcTime ?? (typeof window === "undefined" ? Infinity : 5 * 60 * 1000)
    );
  }

  protected clearGcTimeout() {
    if (this.gcTimeout) {
      clearTimeout(this.gcTimeout);
      this.gcTimeout = undefined;
    }
  }

  protected subscribe = (observer: QueryObserver) => {
    this.observers.push(observer);
    this.clearGcTimeout();

    const unsubscribe = () => {
      this.observers = this.observers.filter((d) => {
        return d !== observer;
      });

      // 구독이 해제될 때 구독된 구독자가 없다면 scheduleGcTimeout을 통해 gcTime timeout이 다시 할당된다.
      if (this.observers.length === 0) {
        this.scheduleGc();
      }
    };

    return unsubscribe;
  };

  setState(
    state: Partial<QueryState<TData>>,
    setStateOptions?: Record<string, unknown>
  ): void {
    this.dispatch({ type: "setState", state, setStateOptions });
  }

  setOptions(options?: QueryOptions<TData>) {
    this.options = { ...this.defaultOptions, ...options };
    this.updateGcTime(this.options.gcTime);
  }

  dispatch = (action: QueryAction<TData>) => {
    const reducer = (state: QueryState<TData>): QueryState<TData> => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            error: action.error,
          };
        case "pause":
          return {
            ...state,
            fetchStatus: "paused",
          };
        case "continue":
          return {
            ...state,
            fetchStatus: "fetching",
          };
        case "fetch":
          return {
            ...state,
            ...{
              fetchStatus: "fetching",
              ...(state.data === undefined
                ? { status: "pending", error: null }
                : {}),
            },
          };
        case "success":
          return {
            ...state,
            data: action.data,
            dataUpdatedAt: action.dataUpdatedAt ?? Date.now(),
            error: null,
            status: "success",
            fetchStatus: "idle",
          };
        case "error": {
          const { error } = action;

          return {
            ...state,
            error,
            fetchStatus: "idle",
            status: "error",
          };
        }

        case "setState":
          return {
            ...state,
            ...action.state,
          };
      }
    };

    this.state = reducer(this.state);
    this.observers.forEach((observer: QueryObserver) => {
      observer.notify();
    });

    this.cache.notify();
  };

  fetch = (): Promise<TData | undefined> => {
    if (!this.promise) {
      this.promise = (async () => {
        if (this.state.fetchStatus !== "idle") {
          return this.state.data; // 이미 fetching 상태인 경우, 현재 데이터 반환
        }

        this.dispatch({ type: "fetch" });

        try {
          if (!this.options.queryFn) {
            throw new Error(`Missing queryFn: '${this.options.queryHash}'`);
          }

          const data = await this.options.queryFn();

          this.dispatch({ type: "success", data, dataUpdatedAt: Date.now() });
          return data;
        } catch (error) {
          const typedError =
            error instanceof Error ? error : new Error(String(error));
          this.dispatch({ type: "error", error: typedError });
          throw error;
        } finally {
          this.promise = null;
        }
      })();
    }

    return this.promise;
  };

  isActive = () => {
    return this.observers.some(
      (observer) => resolveEnabled(observer.options.enabled, this) !== false
    );
  };

  isStaleByTime = (staleTime = 0) => {
    return (
      this.state.data === undefined ||
      !timeUntilStale(this.state.dataUpdatedAt, staleTime)
    );
  };
}

export { Query };
