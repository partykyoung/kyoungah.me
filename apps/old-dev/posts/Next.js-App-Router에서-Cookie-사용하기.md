---
title: Next.js App Router에서 Cookie 사용하기
date: 2024-06-15 14:31:26
tags: ['Next.js']
publish: false
---

## 과정

### localhost 도메인 변경

m1 기준

```
sudo vi /private/etc/hosts
```

![](../images/posts/Next.js-App-Router에서-Cookie-사용하기-1.png)

### localhost에서 HTTPS 허용하기

```
brew install mkcert
```

```
mkcert 위에서 설정한 도메인 주소
```

![](../images/posts/Next.js-App-Router에서-Cookie-사용하기-2.png)

```
mkcert "*.kyoungah.me" localhost 127.0.0.1 ::1
```

실행명령어

```
next dev --experimental-https --experimental-https-key _wildcard.kyoungah.me+3-key.pem --experimental-https-cert _wildcard.kyoungah.me+3.pem
```

![](../images/posts/Next.js-App-Router에서-Cookie-사용하기-3.png)
