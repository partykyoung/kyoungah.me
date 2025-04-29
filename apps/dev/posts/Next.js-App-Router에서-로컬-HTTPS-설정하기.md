---
title: Next.js App Router에서 로컬 HTTPS 설정하기
date: 2024-11-10 14:31:26
tags: ['Next.js']
publish: true
---

Next.js로 어드민을 신규 개발하면서 로컬 환경에 HTTPS 환경을 구축한 경험을 공유하고자 한다.

회사 프로젝트는 Mac(M1)에서 Next.js 14 App Router 버전으로 진행되었으며, 이 글을 작성하며 생성한 프로젝트는 Mac(M1)에서 Next.js 15 App Router 버전으로 진행되었다. 마지막에 next.config.js 설정 관련 부분을 제외하면 두 버전은 차이가 없다.

## 이슈 발생 배경

아이디와 비밀번호를 입력한 후 이를 API 서버에 전송한 후 API 서버가 발급해준 쿠키를 웹 브라우저에 설정하는 작업을 진행하고 있었다. 쿠키를 가지고 오는 것 까지는 문제가 없었는데 개발자 도구를 확인해보면 쿠키가 브라우저에 저장이 되지 않고 있었다.

## 이슈 원인 파악

![쿠키 경고 메시지 확인](/images/posts/Next.js-App-Router-로컬-개발환경에서-HTTPS-환경-구축하기-2.png)
개발자 도구 네트워크 탭에서 response를 확인해보니 쿠키 옆에 warning 표시가 떠 있는걸 볼 수 있었는데 마우스를 갖다대니 메시지가 보였다.

```
the attempt to set a cookie via set-cookie header was blocked because its domain attribute was invalid with regards to the current host url
```

쿠키의 Domain 속성이 현재 요청을 보낸 호스트 URL과 호환되지 않아 warning과 함께 쿠키가 브라우저에 저장이 되지 않은 것이었다.

### 쿠키 속성

백엔드 코드에서 쿠키 설정을 확인해보니 아래와 같았다.

```json
{
    httpOnly: true,
    domain: NODE_ENV !== "local" ? ".domain.example" : "localhost",
    secure: NODE_ENV !== "local",
    maxAge: 1000 * 60 * 60,
    sameSite: "none",
    path: "/",
  }
```

위의 쿠키 속성을 살펴보자.

- HttpOnly: JavaScript를 통해 쿠키 값에 접근하는 것을 막는다.
  - true 이므로 JavaScript를 통해 쿠키 값에 접근할 수 없다.
- Domain: 해당 쿠키가 어느 도메인(및 서브도메인)에 대해 유효한지를 지정한다.
  - API 서버가 개발서버에 배포되었기 때문에 domain.example 도메인과 모든 하위 도메인(api.domain.example, www.domain.example 등)에서 쿠키가 사용된다.
- Secure: HTTPS 연결을 통해서만 쿠키가 전송되도록 보장한다.
  - 마찬가지로 https 연결을 통해사면 쿠키가 전송된다.
- MaxAge: 쿠키의 유효 시간을 설정한다.
  - 회사 코드 보안상의 이유로 임시로 밀리초(milliseconds) 단위로 설정했는데 일반적으로는 초(second) 단위로 설정하는 경우가 많다.
- SameSite: 쿠키가 크로스 사이트 요청 시 어떻게 전송될지를 제어한다.
  - none 속성은 모든 크로스 사이트 요청에 쿠키가 전송되도록 허용하지만, 이 경우 secure 옵션이 true여야 한다
- Path: 쿠키가 전송될 경로를 지정한다.
  - "/"로 설정되어 있으므로, 사이트 내 모든 경로에서 쿠키가 포함되어 전송된다.

### 도메인 불일치

![어드민 작업 환경](/images/posts/Next.js-App-Router-로컬-개발환경에서-HTTPS-환경-구축하기-1.png)
api에서 Next.js Api Route로 쿠키를 가지고 오는 것 까지는 이슈가 없었으나 Next.js Api Route의 url이 http://localhost:3000/login/api 였기 때문에 api 도메인과 일치하지 않아 쿠키가 브라우저에 저장되지 않는 걸 알 수 있었다.

로컬 환경에서 쿠키를 브라우저에 저장하려면 다음 두 가지 조건이 충족되어야 했다.

1. HTTPS 환경이 설정되어 있어야 한다.
2. API 도메인과 프론트엔드 도메인이 일치하도록 구성해야 한다.

## 이슈 해결 과정

### localhost 도메인 이름 변경

Host 파일은 컴퓨터의 운영 체제에서 사용되는 텍스트 파일로, 도메인 이름과 IP 주소를 매핑하는 역할을 한다. 네트워크 요청 시 DNS 서버를 거치지 않고 직접 매핑된 IP 주소를 사용하기 때문에 로컬 환경에서 테스트하거나 특정 도메인을 임시로 변경하는 데 유용하다.

Host 파일에서 localhost의 도메인 이름 api 도메인에 맞춰 변경해주자.

```
sudo vi /private/etc/hosts
```

Mac(M1) 에서는 터미널을 실행한 후 위의 명령어로 hosts 파일을 열 수 있다.

```
127.0.0.1 local.kyoungah.me
```

![host 파일 편집](/images/posts/Next.js-App-Router-로컬-개발환경에서-HTTPS-환경-구축하기-6.png)

마지막 줄에 IP와 원하는 도메인 주소를 입력하면 도메인 변경은 완료다.

![위에서 설정한 도메인으로 출력](/images/posts/Next.js-App-Router-로컬-개발환경에서-HTTPS-환경-구축하기-3.png)

### localhost에서 HTTPS 허용하기

다음으로 HTTP에서 동작하는 localhost를 HTTPS로 동작하게끔 해줘야 한다.

HTTP에는 도청, 위장, 변조 등의 취약점이 있다. 이를 보완하기 위해 SSL(보안 소켓 계층) 또는 TLS(전송 계층 보안) 인증서를 사용하여 HTTP 통신 내용을 암호화 한다. 이러한 기술을 활용한 HTTP가 바로 HTTPS(HTTP Secure)이다.

따라서 HTTPS 환경을 구축하기 위해서는 SSL 또는 TLS 인증서가 필수적이다.

```
brew install mkcert
```

[mkcert](https://github.com/FiloSottile/mkcert)를 사용하면 로컬에서 신뢰할 수 있는 개발 인증서를 만들 수 있다. 없으면 먼저 설치해주자.

```
mkcert "*.kyoungah.me"
```

mkcert 명령어를 사용하여 원하는 도메인을 위한 SSL인증서를 생성한다.
pem, -key.pem 2개의 파일이 생성되고 해당 파일을 ssl인증서로 사용하면 된다.

```
mkcert "*.kyoungah.me" localhost 127.0.0.1
```

여러개의 도메인에 유효한 인증서도 생성할 수 있다.

[next dev 옵션](https://nextjs.org/docs/app/api-reference/cli/next)을 보면 `--experimental-https`, `--experimental-https-key`, `--experimental-https-cert` 라는 옵션이 있다.

- --experimental-https는 HTTPS로 서버를 실행하게끔 해준다.
  - --experimental-https-key, --experimental-https-cert 옵션 없이 실행하면 자동으로 localhost SSL 인증서를 생성한다.
- --experimental-https-key는 HTTPS 키 파일의 경로이다.
- --experimental-https-cert는 HTTPS 인증서 파일의 경로이다.

```
next dev --experimental-https --experimental-https-key _wildcard.kyoungah.me+3-key.pem --experimental-https-cert _wildcard.kyoungah.me+3.pem
```

위에서 생성한 인증서 및 키 파일의 경로와 함께 옵션을 입력하고개발 서버를 실행한다.

![https 환경 성공](/images/posts/Next.js-App-Router-로컬-개발환경에서-HTTPS-환경-구축하기-4.png)
이제 HTTPS로 로컬 서버를 띄울 수 있다!

### Next.js 15

추가로 Next.js 15에서는 바뀐 url로 인해 next/font에서 호출하는 폰트가 제대로 불러지지 않는 이슈가 있다.

```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["*.kyoungah.me"],
};

export default nextConfig;

```

![https 환경 성공](/images/posts/Next.js-App-Router-로컬-개발환경에서-HTTPS-환경-구축하기-5.png)

next.config.js 파일에 allowedDevOrigins를 추가해주면 해결 된다.
Next.js 14 버전에서는 위의 작업을 따로 해주지 않아도 이슈가 발생하지 않는다.
