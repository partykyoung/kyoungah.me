import { isValidTimeout } from "./utils.js";

function getDefaultState(
  options: 
) {
  const data =
    typeof options.initialData === "function"
      ? (options.initialData)()
      : options.initialData;

  const hasData = data !== undefined;

  const initialDataUpdatedAt = hasData
    ? typeof options.initialDataUpdatedAt === "function"
      ? (options.initialDataUpdatedAt as () => number | undefined)()
      : options.initialDataUpdatedAt
    : 0;

  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? (initialDataUpdatedAt ?? Date.now()) : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? "success" : "pending",
    fetchStatus: "idle",
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
  private revertState?: any;
  private cache: any;
  private client: any;
  private retryer?: any;
  private observers: any;
  private defaultOptions?: any;
  private abortSignalConsumed: boolean;

  constructor(config: any) {
    this.gcTime = 1000 * 60 * 5;
    this.abortSignalConsumed = false;
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
    // Default to 5 minutes (Infinity for server-side) if no gcTime is set
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

  setOptions(options?: any): void {
    this.options = { ...this.defaultOptions, ...options };

    this.updateGcTime(this.options.gcTime);
  }
}

export { Query };
