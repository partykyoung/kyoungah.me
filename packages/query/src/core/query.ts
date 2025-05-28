import { isValidTimeout } from "./utils.js";
import type { QueryCache } from "./query-cache.js";

// 쿼리 상태 타입 정의
export interface QueryState<TData = unknown> {
  data: TData | undefined;
  dataUpdatedAt: number;
  error: Error | null;
  status: 'success' | 'error' | 'pending';
  fetchStatus: 'idle' | 'fetching' | 'paused';
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
}

function getDefaultState<TData>(options: QueryOptions<TData>): QueryState<TData> {
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
  | { type: 'failed'; error: Error }
  | { type: 'pause' }
  | { type: 'continue' }
  | { type: 'fetch' }
  | { type: 'success'; data: TData; dataUpdatedAt?: number }
  | { type: 'error'; error: Error }
  | { type: 'setState'; state: Partial<QueryState<TData>>; setStateOptions?: Record<string, unknown> };

class Query<TData = unknown> {
  private gcTime: number;
  private gcTimeout?: ReturnType<typeof setTimeout>;
  readonly queryKey: unknown[];
  readonly queryHash: string;
  private options!: QueryOptions<TData>; // definite assignment assertion
  state: QueryState<TData>;

  private initialState: QueryState<TData>;
  private cache: QueryCache;
  private client: QueryClientType;
  observers: QueryObserver[];
  private defaultOptions?: QueryOptions<TData>;
  private promise: Promise<TData> | null;

  constructor(config: QueryConfig<TData>) {
    this.gcTime = 1000 * 60 * 5;
    this.defaultOptions = config.defaultOptions;
    this.observers = [];
    this.client = config.client;
    this.cache = this.client.getQueryCache();
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.promise = null;
    
    this.setOptions(config.options);
    this.initialState = getDefaultState(this.options);
    this.state = config.state ?? this.initialState;
    this.scheduleGc();
  }

  destroy(): void {
    this.clearGcTimeout();
  }

  protected scheduleGc(): void {
    this.clearGcTimeout();

    if (isValidTimeout(this.gcTime)) {
      this.gcTimeout = setTimeout(() => {
        this.optionalRemove();
      }, this.gcTime);
    }
  }

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

  protected optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === "idle") {
      this.cache.remove(this);
    }
  }

  dispatch(action: QueryAction<TData>) {
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
      observer.onQueryUpdate();
    });

    this.cache.notify({ query: this, type: "updated", action });
  }

  setState(state: Partial<QueryState<TData>>, setStateOptions?: Record<string, unknown>): void {
    this.dispatch({ type: "setState", state, setStateOptions });
  }

  setOptions(options?: QueryOptions<TData>) {
    this.options = { ...this.defaultOptions, ...options };
    this.updateGcTime(this.options.gcTime);
  }

  fetch(): Promise<TData> {
    if (!this.promise) {
      this.promise = (async () => {
        this.dispatch({ type: "fetch" });

        try {
          if (!this.options.queryFn) {
            throw new Error(`Missing queryFn: '${this.options.queryHash}'`);
          }

          const data = await this.options.queryFn();

          this.dispatch({ type: "success", data, dataUpdatedAt: Date.now() });
          return data;
        } catch (error) {
          const typedError = error instanceof Error ? error : new Error(String(error));
          this.dispatch({ type: "error", error: typedError });
          throw error;
        } finally {
          this.promise = null;
        }
      })();
    }

    return this.promise;
  }
  
  // 옵저버 추가 메서드
  addObserver(observer: QueryObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }
  
  // 옵저버 제거 메서드
  removeObserver(observer: QueryObserver): void {
    this.observers = this.observers.filter((x) => x !== observer);
    if (!this.observers.length) {
      this.optionalRemove();
    }
  }
  
  // 옵저버 구독 메서드
  subscribe(observer: QueryObserver): () => void {
    this.addObserver(observer);
    return () => {
      this.removeObserver(observer);
    };
  }
}

export { Query };
