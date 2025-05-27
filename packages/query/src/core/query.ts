import { isValidTimeout } from "./utils.js";

function getDefaultState(options: any) {
  const data =
    typeof options.initialData === "function"
      ? options.initialData()
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
    status: hasData ? "success" : "pending", // 'success' | 'error' | 'pending'
    fetchStatus: "idle", // 'idle' | 'fetching'
  };
}

class Query {
  private gcTime: number;
  private gcTimeout?: ReturnType<typeof setTimeout>;
  private queryKey: any;
  private queryHash: string;
  private options: any;
  private state: any;

  private initialState: any;
  private cache: any;
  private client: any;
  private observers: any;
  private defaultOptions?: any;
  private promise: any;

  // 재시도 관련 코드 제거됨

  constructor(config: any) {
    this.gcTime = 1000 * 60 * 5;
    this.defaultOptions = config.defaultOptions;
    this.setOptions(config.options);
    this.observers = [];
    this.client = config.client;
    this.cache = this.client.getQueryCache();
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
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

  dispatch(action: any) {
    const reducer = (state: any) => {
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

    this.observers.forEach((observer: any) => {
      observer.onQueryUpdate();
    });

    this.cache.notify({ query: this, type: "updated", action });
  }

  setState(state: any, setStateOptions?: any): void {
    this.dispatch({ type: "setState", state, setStateOptions });
  }

  setOptions(options?: any) {
    this.options = { ...this.defaultOptions, ...options };
    this.updateGcTime(this.options.gcTime);
  }

  fetch() {
    if (!this.promise) {
      this.promise = (async () => {
        this.dispatch({ type: "fetch" });

        try {
          if (!this.options.queryFn) {
            throw new Error(`Missing queryFn: '${this.options.queryHash}'`);
          }

          const data = await this.options.queryFn();

          this.dispatch({ type: "success", data, dataUpdatedAt: Date.now() });
        } catch (error) {
          this.dispatch({ type: "error", error });
        } finally {
          this.promise = null;
        }
      })();
    }

    return this.promise;
  }
}

export { Query };
