---
title: JWT(Json Web Token)
date: 2020-03-18 23:31:00
tags: ["JWT"]
publish: true
---

## JWT(Json Web Token)

- 두 개체 간의 정보를 안전하게 JSON 객체로 전송하기 위한 간결하고 독립적인 방법을 정의하는 개방형 표준([RFC 7519](https://tools.ietf.org/html/rfc7519))
  - 정보는 디지털 서명이 되어 있기 때문에 신뢰할 수 있다.
  - HMAC 알고리즘을 사용한 비밀키 또는 RAS이나 ECDSA를 사용하는 공개 / 개인키 쌍을 사용하여 서명할 수 있다.

## 언제 JWT를 사용할 수 있을까?

- 인증
  - JWT를 사용하는 가장 흔한 시나리오.
  - 유저가 로그인을 했을 때, 서버에서 사용자의 정보를 담은 토큰을 발급한다. 이 후로는 유저가 서버에 요청을 할 때마다 JWT가 포함된다. 유저는 해당 토큰으로 서비스 및 자원에 접근할 수 있다.
- 정보 교환
  - JWT는 두 개체 사이에서 안전하게 정보를 전달할 수 있는 좋은 방법이다.
  - 서명이 되어 있기 때문에 발신자가 누구이고 위조가 되진 않았는지, 정보 역시 조작되진 않았는지 검증할 수 있다.

## JWT 구조

JWT는 (.)으로 구분하여 세부분으로 구성되어 있다.

```
xxxxx.yyyyy.zzzzz
```

첫번째 부분은 헤더(Header), 두번째 부분은 내용(Payload), 세번째 부분은 서명(Signature)이다.

### Header

헤더(Header)는 두가지 요소로 구성되어 있다.

```
{
  alg: "HS256",
  typ: "JWT"
}
```

- typ: JWT 같은 토큰의 타입을 지정한다.
- alg: 헤싱 알고리즘. 주로 HMAC SHA256 또는 RSA 알고리즘을 사용한다.

이 정보들을 Base64로 인코딩한다.

### Payload

내용(Payload)에는 클레임(Claim)을 담고 있다. 클레임이란 사용자에 대한 프로퍼티나 속성을 말하며 name/value의 한쌍으로 이루어져 있다.
클레임에는 3가지 타입이 있다.

#### 등록된 (registered) 클레임

정보교환에 응하도록 미리 정의된 클레임. 필수는 아니지만 사용을 권장하고 있다.

- iss: 토큰 발급자 (issuer)
- sub: 토큰 정보 (subject)
- aud: 토큰 대상자 (audience)
- exp: 토큰의 만료시간 (expiration)
  - 현재 시간 보다 이후로 설정되어 있어야 한다.
- nbf: Not Before 클레임
  - 이시간 이전에는 토큰을 처리하지 않아야 함을 의미한다.
- iat: 토큰이 발급된 시간 (issued at)
- jti: JWT ID
  - JWT의 고유 식별자로서 중복처리 방지를 위해 사용한다.

#### 공개 (public) 클레임

공개 (Public) 클레임의 이름은 마음대로 정의할 수 있으나 충돌이 방지된 이름을 가지고 있어야한다. 충돌을 피하기 위해서는 클레임 이름을 IANA Json Web Token Registry 안에 정의되어 있거나 충돌 방지 namespace가 포함된 URI로 정의해야 한다.

#### 비공개 (private) 클레임

등록된 클레임도 공개 클레임도 아닌 클레임. 정보를 공유하기 위해 양측간에(클라이언트 / 서버) 협의하에 위해 사용되는 클레임 이름이다.

Payload를 Base 64로 인코딩하면 JWT의 두번째 부분이 된다.

-> 서명이 된 토큰은 정보 위변조는 막을 수 있으나 누구나 읽을 수 있기 때문에 절대로 암호화되지 않은 payload나 header에 비밀 정보를 넣으면 안된다.

### Signature

Header의 인코딩값과 Payload의 인코딩값, 비밀키, Header에 정의된 헤싱 알고리즘으로 서명을 생성한다.

예를 들어 HMAC SHA256 알고리즘을 사용하면 Signature은 다음과 같이 생성된다.

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

이 서명은 메시지가 도중에 바뀌지는 않았는지 인증하는데 사용되며 비밀키로 서명된 토큰의 경우 발신자도 인증할 수 있다.

![JWT Example](/images/backend/json-web-token-1.png)
Header 인코딩값, Payload 인코딩값, 서명을 .로 구분하면서 모두 합치면 JWT 토큰이 완성된다.

[JWT 공식 사이트](https://jwt.io/)에서 JWT 토크를 생성 및 확인해볼 수 있다.

## Reference

> - [Introduction to JSON Web Tokens](https://jwt.io/introduction/)
> - [[JWT] JSON Web Token 소개 및 구조](https://velopert.com/2389)
> - [JWT에 대한 간단 정리](https://icarus8050.tistory.com/12)
> - [REST JWT(JSON Web Token)소개 - #1 개념 소개](https://bcho.tistory.com/999)
