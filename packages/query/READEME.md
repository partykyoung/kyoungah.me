# @kyoungah.me/query

데이터 페칭과 상태 관리를 위한 경량 쿼리 라이브러리입니다. React Query와 유사한 API를 제공하며, 코어 로직과 React 통합을 분리하여 설계되었습니다.

## 프로젝트 구조

```
packages/query/
├── src/
│   ├── core/                   # 코어 기능 (프레임워크 독립적)
│   │   ├── index.ts            # 코어 모듈 내보내기
│   │   ├── query.ts            # 쿼리 클래스 정의
│   │   ├── query-cache.ts      # 쿼리 캐싱 메커니즘
│   │   ├── query-client.ts     # 쿼리 클라이언트 API
│   │   ├── query-observer.ts   # 쿼리 상태 관찰 및 구독
│   │   └── utils.ts            # 유틸리티 함수
│   └── react/                  # React 통합
│       ├── index.ts            # React 모듈 내보내기
│       ├── query-client-context.tsx # React 컨텍스트 관리
│       └── use-query.ts        # React Hook 구현
└── build/                      # 빌드 결과물
```

## 핵심 기능

### 1. 쿼리 관리 시스템

- **Query**: 단일 데이터 요청을 나타내는 클래스로, 쿼리 상태와 메타데이터를 관리합니다.
- **QueryCache**: 쿼리 인스턴스를 저장하고 관리하는 중앙 저장소입니다.
- **QueryClient**: 쿼리 생성, 무효화, 리패치 등을 담당하는 주요 API입니다.
- **QueryObserver**: 쿼리 상태 변화를 구독하고 상태 업데이트를 관리합니다.

### 2. 상태 관리

- 각 쿼리는 다음과 같은 상태를 관리합니다:
  - **data**: 쿼리 결과 데이터
  - **status**: 쿼리 상태 ('success', 'error', 'pending')
  - **fetchStatus**: 페칭 상태 ('idle', 'fetching', 'paused')
  - **error**: 오류 정보
  - **dataUpdatedAt**: 데이터 업데이트 시간

### 3. React 통합

- **QueryClientContext**: React 애플리케이션에 QueryClient를 제공하는 컨텍스트
- **useQuery**: 컴포넌트에서 쿼리를 손쉽게 사용할 수 있는 React Hook

## 동작 원리

### 데이터 페칭 및 캐싱 과정

1. **쿼리 요청 시작**:

   - `useQuery` 훅이나 `QueryClient`를 통해 쿼리를 요청합니다.
   - 쿼리 키와 쿼리 함수를 기반으로 고유한 쿼리 해시를 생성합니다.

2. **캐시 확인**:

   - `QueryCache`에서 해당 쿼리 해시의 데이터가 있는지 확인합니다.
   - 캐시된 데이터가 있고 'stale' 상태가 아니면 해당 데이터를 즉시 반환합니다.

3. **데이터 페칭**:

   - 캐시가 없거나 'stale' 상태이면 `queryFn`을 실행하여 데이터를 가져옵니다.
   - 페칭 중에는 `fetchStatus`가 'fetching'으로 설정됩니다.

4. **상태 업데이트 및 알림**:
   - 데이터 페칭이 완료되면 `QueryCache`에 저장합니다.
   - `QueryObserver`를 통해 상태 변화를 구독자들에게 알립니다.

### 리액트 통합 매커니즘

1. **컨텍스트 설정**:

   - `QueryClientContext.Provider`를 통해 애플리케이션에 `QueryClient` 인스턴스를 제공합니다.

2. **훅 사용**:

   - `useQuery` 훅은 내부적으로 `QueryObserver`를 생성하여 쿼리 상태를 구독합니다.
   - `useSyncExternalStore` API를 활용하여 리액트 컴포넌트와 쿼리 상태를 동기화합니다.

3. **라이프사이클 관리**:
   - 컴포넌트 마운트 시 쿼리 구독이 시작됩니다.
   - 컴포넌트 언마운트 시 쿼리 구독이 정리됩니다.

## 사용 예시

```tsx
// QueryClient 생성 및 Provider 설정
import { QueryClient } from "@kyoungah.me/query/core";
import { QueryClientProvider } from "@kyoungah.me/query/react";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourComponent />
    </QueryClientProvider>
  );
}

// 컴포넌트에서 useQuery 사용
import { useQuery } from "@kyoungah.me/query/react";

function YourComponent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetch("/api/posts").then((res) => res.json()),
    staleTime: 5000, // 5초 동안 데이터를 'fresh'하게 유지
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생!</div>;

  return (
    <div>
      {data.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```
