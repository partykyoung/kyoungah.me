---
title: Next.js App Router 로컬 개발환경에서 HTTPS 환경 구축하기
date: 2024-11-10 14:31:26
tags: ["Next.js"]
publish: false
---

Next.js로 어드민을 신규 개발하면서 HTTPS 환경을 구축한 경험을 공유하고자 한다.

회사 프로젝트는 Mac(M1) 환경에서 Next.js 14 App Router 버전으로 진행되었으며, 이 글 작성 시 생성된 프로젝트는 Mac(M1) 환경에서 Next.js 15 App Router 버전으로 진행되었다. 마지막에 next.config.js 설정 관련 부분을 제외하면 두 버전은 차이가 없다.

## 이슈 발생 배경

API 서버와 로컬 개발 환경의 도메인이 달라 쿠키가 제대로 설정되지 않는 이슈가 있었다.

### 쿠키의 secure 속성

### 도메인 불일치

쿠키 속성 중 secure라는 속성이 있다. 이 속성이 true이면 https에서만 통신을 할 수 있는데 localhost 주소는 http://localhost:3000이다.

도메인이 다르면 쿠키가 적용되지 않음:
만약 쿠키를 설정할 때 도메인 속성을 example.com 같이 현재 도메인과 다른 값으로 설정하면, 브라우저는 현재 도메인(여기서는 localhost)과 일치하지 않기 때문에 해당 쿠키를 저장하거나 전송하지 않습니다.

서브도메인과의 관계:
도메인을 명시하면 해당 도메인과 그 하위 도메인에만 쿠키가 전송됩니다. 예를 들어, 도메인을 .example.com으로 설정하면 sub.example.com에서도 쿠키가 유효하지만, localhost에서는 쿠키가 적용되지 않습니다.

## 이슈 해결 과정

next.js 환경의 프로젝트에서 next dev 서버를 띄울 떄 --experimental-https라는 옵션이 있다.
해당 옵션을 사용하면 사설 인증서를 자동으로 생성하며 https 환경에서 로컬환경을 띄울 수 있다.

하지만 로컬도메인과 api 도메인이 달라서 쿠키가 정상적으로 적용되지 않는 이슈는 여전히 남아 있으므로 로컬 도메인과 api 도메인을 먼저 맞춰줘야 한다.

### localhost 도메인 변경

먼저 도메인을 API 도메인에 맞춰 변경해야 했다.
예를 들어 API 도메인이 https://api.kyoungah.me 이면 웹브라우저 도메인은 https://\*.kyoungah.me가 되어야 한다.

Mac(m1) 기준으로 /ect/hosts에서 도메인을 등록할 수 있었다.

```
sudo vi /private/etc/hosts
```

![](/images/posts/Next.js-App-Router에서-Cookie-사용하기-1.png)

### localhost에서 HTTPS 허용하기

다음으로 http에서 동작하는 localhost를 https로 동작하게끔 해줘야 한다.

```
brew install mkcert
```

mkcert를 사용하면 로컬에서 신뢰할 수 있는 개발 인증서를 만들 수 있다. 없으면 먼저 설치해주자.

```
mkcert "*.kyoungah.me"
```

mkcert 명령어를 사용하여 원하는 도메인을 위한 ssl인증서와 개인키를 생성한다.

```
mkcert "*.kyoungah.me" localhost 127.0.0.1
```

여러개의 도메인에 유효한 인증서도 생성할 수 있다.

![](../images/posts/Next.js-App-Router에서-Cookie-사용하기-2.png)

실행명령어

```
next dev --experimental-https --experimental-https-key _wildcard.kyoungah.me+3-key.pem --experimental-https-cert _wildcard.kyoungah.me+3.pem
```

[next dev 옵션](https://nextjs.org/docs/app/api-reference/cli/next)을 보면 `--experimental-https`, `--experimental-https-key`, `--experimental-https-cert` 라는 옵션이 있다.

- --experimental-https는 HTTPS로 서버를 실행하게끔 해준다.
- --experimental-https-key는 HTTPS 키 파일의 경로이다.
- --experimental-https-cert는 HTTPS 인증서 파일의 경로이다.

--experimental-https-cert에 위에서 생성한 인증서 및 키 파일의 경로를 적어주고 --experimental-https옵션으로 next 개발 서버를 실행한다.

![](../images/posts/Next.js-App-Router에서-Cookie-사용하기-3.png)
이제 https로 로컬 서버를 띄울 수 있다!

추가로 위의 이미지에서 next/font에서 호출하는 폰트가 제대로 불러지지 않는 이슈가 있는데

```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["*.kyoungah.me"],
};

export default nextConfig;

```

next.config.js 파일에 allowedDevOrigins를 추가해주면 정상적으로 호출 된다.

https://github.com/vercel/next.js/issues/77045
