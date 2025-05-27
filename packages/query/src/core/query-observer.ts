class QueryObserver {
  protected listeners = new Set<any>();
  private client: any;
  private options: any;

  constructor(client: any, options?: any) {
    this.client = client;
    this.options = options;
    this.subscribe = this.subscribe.bind(this);
  }

  subscribe(listener: TListener): () => void {
    this.listeners.add(listener);

    this.onSubscribe();

    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }

  hasListeners(): boolean {
    return this.listeners.size > 0;
  }

  protected onSubscribe() {
    // Do nothing
  }

  protected onUnsubscribe() {
    // Do nothing
  }

  getCurrentResult() {
    return this.#currentResult;
  }
}

export { QueryObserver };
