import { QueryClient } from "./query-client.js";
import { Query } from "./query.js";
import { hashQueryKeyByOptions } from "./utils.js";

export interface QueryStore {
  has: (queryHash: string) => boolean;
  set: (queryHash: string, query: Query) => void;
  get: (queryHash: string) => Query | undefined;
  delete: (queryHash: string) => void;
  values: () => IterableIterator<Query>;
}

class QueryCache {
  private querys: Map<string, Query>;

  constructor() {
    this.querys = new Map<string, Query>();
  }

  build(client: QueryClient, options: any) {
    const queryKey = options.queryKey;
    const queryHash =
      options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
    let query = this.get(queryHash);

    if (!query) {
      query = new Query({
        client,
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state,
        defaultOptions: client.getQueryDefaults(queryKey),
      });
      this.add(query);
    }

    return query;
  }

  get() {}

  getAll() {}

  add() {}

  notify() {}
}

export { QueryCache };
