
/**
 * QueryClient 타입 정의
 * 쿼리 캐시를 관리하고 쿼리 옵션의 기본값을 설정하는 역할
 */
type QueryClientType = {
  getQueryCache: () => {
    build: (client: QueryClientType, options: QueryOptionsType) => QueryType;
  };
  defaultQueryOptions: (options: QueryOptionsType) => QueryOptionsType;
};

/**
 * 쿼리 객체의 타입 정의
 * 상태 관리 및 옵저버 패턴을 구현하는 핵심 객체
 */
type QueryType = {
  state: QueryStateType;
  subscribe: (observer: QueryObserver) => () => void;
  fetch: () => Promise<unknown>;
  addObserver: (observer: QueryObserver) => void;
  removeObserver: (observer: QueryObserver) => void;
};

/**
 * 쿼리 상태 타입 정의
 * 데이터, 에러, 로딩 상태 등 쿼리의 현재 상태를 나타냄
 */
type QueryStateType = {
  data?: unknown;
  error: Error | null;
  status: "pending" | "error" | "success";
  fetchStatus: "idle" | "fetching" | "paused";
  lastUpdated?: number;
};

/**
 * 쿼리 옵션 타입 정의
 * 쿼리 생성 및 동작을 제어하는 설정값들
 */
type QueryOptionsType = {
  queryKey?: unknown;             // 쿼리를 식별하는 키
  queryFn?: () => Promise<unknown>; // 데이터를 가져오는 비동기 함수
  staleTime?: number;             // 데이터가 오래된 것으로 간주되기까지의 시간(ms)
  enabled?: boolean;              // 쿼리 활성화 여부
  [key: string]: unknown;         // 기타 옵션들
};

/**
 * 리스너 타입 정의
 * 쿼리 결과가 변경되었을 때 호출되는 콜백 함수
 */
type TListener = (result: QueryStateType) => void;

/**
 * QueryObserver 클래스
 * 쿼리의 상태를 관찰하고 변경사항을 구독자에게 알리는 역할을 담당
 * TanStack Query의 핵심 클래스를 단순화한 버전
 */
class QueryObserver {
  protected listeners = new Set<TListener>(); // 상태 변화를 구독하는 리스너 집합
  private client: QueryClientType;           // QueryClient 인스턴스 참조
  private options: QueryOptionsType;         // 쿼리 옵션
  private currentQuery: QueryType | null = null;     // 현재 관찰 중인 쿼리
  private currentResult: QueryStateType | null = null; // 마지막으로 계산된 쿼리 결과
  private notify: TListener | undefined;     // 콜백 함수

  /**
   * QueryObserver 생성자
   * @param client - 쿼리 클라이언트 인스턴스
   * @param options - 쿼리 옵션
   */
  constructor(client: QueryClientType, options?: QueryOptionsType) {
    this.client = client;
    this.options = options || ({} as QueryOptionsType);
    this.subscribe = this.subscribe.bind(this); // this 바인딩 유지
  }

  /**
   * 현재 쿼리 인스턴스를 가져옴
   * 클라이언트의 쿼리 캐시를 통해 쿼리를 생성하거나 기존 쿼리를 반환
   * @returns 쿼리 인스턴스
   */
  getQuery = () => {
    const query = this.client.getQueryCache().build(this.client, this.options);
    this.currentQuery = query;
    return query;
  };

  /**
   * 현재 쿼리의 상태를 가져옴
   * @returns 쿼리 상태
   */
  getResult = () => {
    return this.getQuery().state;
  };

  /**
   * 현재 캐시된 결과를 가져오거나 없으면 최신 결과를 조회
   * @returns 쿼리 상태
   */
  getCurrentResult() {
    return this.currentResult || this.getResult();
  }

  /**
   * 활성 리스너가 있는지 확인
   * @returns 리스너 존재 여부
   */
  hasListeners(): boolean {
    return this.listeners.size > 0;
  }

  /**
   * 쿼리 업데이트 시 호출되는 콜백 함수
   * 쿼리가 변경될 때마다 결과를 업데이트하고 리스너에게 알림
   */
  onQueryUpdate = () => {
    // 결과 업데이트
    const nextResult = this.getQuery().state;
    this.currentResult = nextResult;

    // 리스너에게 알림
    if (this.notify) {
      this.notify(nextResult);
    }
  };

  /**
   * 쿼리 상태 변경을 구독하는 함수
   * @param callback - 쿼리 상태가 변경될 때 호출될 콜백 함수
   * @returns 구독 취소 함수
   */
  subscribe(callback: TListener) {
    // 콜백 함수 설정
    this.notify = callback;

    // 쿼리 인스턴스 가져오기
    const query = this.getQuery();

    // 이 옵저버를 쿼리에 등록
    const unsubscribeQuery = query.subscribe(this);

    // 쿼리의 데이터가 오래되었는지 확인
    const { lastUpdated } = query.state;
    const { staleTime = 0 } = this.options;

    // 마지막 업데이트 시간이 없거나 staleTime보다 오래되었으면 다시 가져옴
    const needsToFetch = !lastUpdated || Date.now() - lastUpdated > staleTime;

    if (needsToFetch) {
      query.fetch();
    }

    // 구독 취소 함수 반환
    const unsubscribe = () => {
      this.notify = undefined;
      unsubscribeQuery();
    };

    return unsubscribe;
  }

  /**
   * 첫 번째 리스너가 등록되었을 때 호출됨
   * 쿼리 인스턴스에 이 옵저버를 연결
   */
  protected onSubscribe() {
    // 첫 번째 리스너가 추가되면 쿼리에 옵저버 등록
    if (this.listeners.size === 1) {
      this.currentQuery = this.getQuery();
      this.currentQuery.addObserver(this);
    }
  }

  /**
   * 마지막 리스너가 제거되었을 때 호출됨
   * 쿼리 인스턴스에서 이 옵저버를 제거
   */
  protected onUnsubscribe() {
    // 모든 리스너가 제거되면 쿼리에서 옵저버 제거
    if (!this.hasListeners()) {
      this.currentQuery?.removeObserver(this);
    }
  }
}

// QueryObserver 클래스 내보내기
export { QueryObserver };
