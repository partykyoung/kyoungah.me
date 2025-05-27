import { isValidTimeout } from "./utils.js";

/**
 * 쿼리의 초기 상태를 생성하는 함수
 * 초기 데이터 유무에 따라 상태값을 설정하고 반환합니다.
 *
 * @param options 쿼리 옵션 객체
 * @returns 초기화된 쿼리 상태 객체
 */
function getDefaultState(options: any) {
  // initialData가 함수인 경우 실행하여 데이터를 얻고, 아니면 값 그대로 사용
  const data =
    typeof options.initialData === "function"
      ? options.initialData()
      : options.initialData;

  // 데이터의 존재 여부 확인
  const hasData = data !== undefined;

  // 초기 데이터의 업데이트 시간 계산
  const initialDataUpdatedAt = hasData
    ? typeof options.initialDataUpdatedAt === "function"
      ? (options.initialDataUpdatedAt as () => number | undefined)()
      : options.initialDataUpdatedAt
    : 0;

  // 쿼리의 초기 상태 객체 반환
  return {
    data, // 쿼리 데이터
    dataUpdatedAt: hasData ? (initialDataUpdatedAt ?? Date.now()) : 0, // 데이터 업데이트 시간
    error: null, // 오류 상태
    status: hasData ? "success" : "pending", // 상태: 'success' | 'error' | 'pending'
    fetchStatus: "idle", // 가져오기 상태: 'idle' | 'fetching'
  };
}

/**
 * Query 클래스
 *
 * 단일 쿼리에 대한 상태 관리와 데이터 가져오기를 담당하는 클래스입니다.
 * 캐시 관리, 가비지 컬렉션, 상태 업데이트 및 관찰자 알림 기능을 제공합니다.
 */
class Query {
  /** 가비지 컬렉션 타임아웃 (밀리초) */
  private gcTime: number;
  /** 가비지 컬렉션 타이머 ID */
  private gcTimeout?: ReturnType<typeof setTimeout>;
  /** 이 쿼리를 식별하는 키 */
  private queryKey: any;
  /** 쿼리 키의 해시값 (캐시 식별자로 사용) */
  private queryHash: string;
  /** 쿼리 옵션 */
  private options: any;
  /** 현재 쿼리 상태 */
  private state: any;

  /** 초기 쿼리 상태 */
  private initialState: any;
  /** 쿼리 캐시 인스턴스 참조 */
  private cache: any;
  /** QueryClient 인스턴스 참조 */
  private client: any;
  /** 이 쿼리를 구독하는 관찰자 목록 */
  private observers: any;
  /** 기본 옵션 */
  private defaultOptions?: any;
  /** 현재 진행 중인 가져오기 작업의 프로미스 */
  private promise: any;

  // 재시도 관련 코드 제거됨

  /**
   * Query 클래스의 생성자
   * 쿼리 인스턴스를 초기화하고 가비지 컬렉션을 예약합니다.
   *
   * @param config 쿼리 설정 객체
   */
  constructor(config: any) {
    this.gcTime = 1000 * 60 * 5; // 기본 가비지 컬렉션 시간: 5분
    this.defaultOptions = config.defaultOptions;
    this.setOptions(config.options);
    this.observers = [];
    this.client = config.client;
    this.cache = this.client.getQueryCache();
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.initialState = getDefaultState(this.options);
    this.state = config.state ?? this.initialState;
    this.scheduleGc(); // 가비지 컬렉션 예약
  }

  /**
   * 쿼리 인스턴스 소멸 시 정리 작업 수행
   * 타이머와 같은 리소스를 해제합니다.
   */
  destroy(): void {
    this.clearGcTimeout();
  }

  /**
   * 가비지 컬렉션 타이머를 예약합니다.
   * gcTime 이후에 사용되지 않는 쿼리를 캐시에서 제거합니다.
   */
  protected scheduleGc(): void {
    this.clearGcTimeout();

    if (isValidTimeout(this.gcTime)) {
      this.gcTimeout = setTimeout(() => {
        this.optionalRemove();
      }, this.gcTime);
    }
  }

  /**
   * 가비지 컬렉션 시간을 업데이트합니다.
   * 기존 값과 새로운 값 중 더 큰 값을 사용하여 가비지 컬렉션 시간을 설정합니다.
   *
   * @param newGcTime 새로운 가비지 컬렉션 시간 (밀리초)
   */
  protected updateGcTime(newGcTime: number | undefined): void {
    this.gcTime = Math.max(
      this.gcTime || 0,
      newGcTime ?? (typeof window === "undefined" ? Infinity : 5 * 60 * 1000)
    );
  }

  /**
   * 가비지 컬렉션 타이머를 취소합니다.
   */
  protected clearGcTimeout() {
    if (this.gcTimeout) {
      clearTimeout(this.gcTimeout);
      this.gcTimeout = undefined;
    }
  }

  /**
   * 쿼리 인스턴스의 조건부 제거
   * 관찰자가 없고 가져오기 상태가 대기 중일 때만 캐시에서 제거합니다.
   */
  protected optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === "idle") {
      this.cache.remove(this);
    }
  }

  /**
   * 액션을 처리하여 상태를 업데이트하고 관찰자에게 알립니다.
   * 리덕스와 유사한 방식으로 상태 업데이트 로직을 관리합니다.
   * 
   * @param action 상태 업데이트를 위한 액션 객체
   */
  dispatch(action: any) {
    // 상태를 업데이트하는 리듀서 함수
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
              // 기존 데이터가 없는 경우에만 상태를 'pending'으로 변경
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

    // 리듀서를 사용하여 상태 업데이트
    this.state = reducer(this.state);

    // 모든 관찰자에게 업데이트 알림
    this.observers.forEach((observer: any) => {
      observer.onQueryUpdate();
    });

    // 캐시에도 업데이트 알림
    this.cache.notify({ query: this, type: "updated", action });
  }

  /**
   * 쿼리 상태를 직접 설정합니다.
   * 내부적으로 setState 액션을 디스패치합니다.
   * 
   * @param state 새로운 상태 객체 또는 일부
   * @param setStateOptions 상태 설정 옵션
   */
  setState(state: any, setStateOptions?: any): void {
    this.dispatch({ type: "setState", state, setStateOptions });
  }

  /**
   * 쿼리 옵션을 설정하고 가비지 컬렉션 시간을 업데이트합니다.
   * 
   * @param options 설정할 옵션 객체
   */
  setOptions(options?: any) {
    this.options = { ...this.defaultOptions, ...options };
    this.updateGcTime(this.options.gcTime);
  }

  /**
   * 쿼리 데이터를 가져오는 메서드
   * 이미 진행 중인 요청이 있다면 그 프로미스를 반환하고, 
   * 없다면 새로운 요청을 시작합니다.
   * 
   * @returns 쿼리 데이터를 가져오는 프로미스
   */
  fetch() {
    if (!this.promise) {
      this.promise = (async () => {
        // 가져오기 시작 액션 디스패치
        this.dispatch({ type: "fetch" });

        try {
          // queryFn이 없으면 오류 발생
          if (!this.options.queryFn) {
            throw new Error(`Missing queryFn: '${this.options.queryHash}'`);
          }

          // 쿼리 함수 실행하여 데이터 가져오기
          const data = await this.options.queryFn();

          // 성공 액션 디스패치
          this.dispatch({ type: "success", data, dataUpdatedAt: Date.now() });
        } catch (error) {
          // 오류 액션 디스패치
          this.dispatch({ type: "error", error });
        } finally {
          // 작업 완료 후 프로미스 초기화
          this.promise = null;
        }
      })();
    }

    return this.promise;
  }
}

export { Query };
