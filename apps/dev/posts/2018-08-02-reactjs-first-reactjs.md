---
title: React
date: 2018-08-02 02:49:46
tags: ["React"]
publish: true
---

## React?

페이스북에서 개발한 오픈소스 JavaScript Library.

## React 특징

### Only View

React는 오직 View만 신경쓰고 담당하는 Library 이다.

### JSX

React는 컴포넌트를 화면에 어떻게 보일지를 정의할 때 JSX를 사용한다. JSX는 JavaScript XML의 약자이다.
JSX를 사용하지 않아도 되지만 사용하는게 훨씬 편하다.

### Virtual DOM

Virtual DOM 을 사용하여 상태의 변함에 따라 선택적으로 유저 인터페이스를 렌더링 한다. 따라서, 최소한의 DOM 처리로 컴포넌트들을 업데이트 할 수 있게 해준다.

DOM은 문서 객체 모델(Document Object Model)의 약자이다. HTML과 XML 문서를 위한 API 이며 문서의 구조화된 표현을 제공한다.

Virtual DOM은 실제 DOM의 빠른 인 메모리의 형태이며 JavaScript와 DOM이 반응을 하는것 처럼 다룰 수 있게 하는 추상적 개념이다. 동작과정은 아래의 순서와 같다.

1. 데이터 모델 상태가 변경될 때 마다 Virtual DOM과 React는 Virtual DOM 표현에 맞게 UI를 다시 렌더링한다.

- 컴포넌트가 초기 렌더링을 할 때 render 함수를 사용하는데 이 함수는 View의 생김새, 작동하는 방법 같은 정보를 지닌 객체를 반환한다.
  렌더링이 끝나면 지니고 있는 정보들을 사용하여 HTML 마크업을 만들고 지정해놓은 DOM 요소 안에 주입한다.
  컴포넌트가 데이터를 업데이트 했을 때 새로운 데이터를 가지고 render 함수를 또 호출한다.

2. React는 두 개의 Virtual DOM 사이의 차이점, 즉 실제 DOM이 변경되어야 하는 부분을 연산한다.

- render 함수가 반환한 결과와 이전 render 함수가 만들었던 정보를 최소한의 연산으로 비교한다.

3. React는 실제 DOM에서 변경 되어야 하는 부분만 새로 실제 DOM에 적용한다.

두 Virtual DOM 표현의 차이점을 찾고 실제 DOM에 업데이트 된 패치만 다시 랜더링하는 과정은 빠르며 실제로 다시 그려져야 하는 부분이 무엇인지 고민할 필요가 없다. UI를 업데이트하는 과정에서 생기는 복잡함을 모두 해소하고 더욱 쉽게 업데이트에 접근할 수 있다.

### Component

Component는 UI를 재사용할 수 있는 독립적인 단위 라고 볼 수있다.
UI는 컴포넌트를 이용해 제작하며 원하는 방법으로 이러한 컴포넌트를 조합할 수 있다. 실제로 애플리케이션을 개발할 때는 커스텀 컴포넌트를 제작하게 된다.

### 단방향 데이터 흐름

부모 컴포넌트에서 자식 컴포넌트로 흐르는 단방향 데이터 흐름을 지향한다.

## 마무리

회사에서 이때까지 혼자서 프론트앤드를 담당하다가 신입이 들어오면서 모르는게 있으면 가르쳐 주고 같이 협업하게 되었다. 과연 내가 누구에게 가르쳐주고 도와줄만큼 React를 잘알고 있나 싶어서 리마인드 하는식으로 다시 한번 되짚고 넘어가보고자 한다.
열심히 공부해야지.

## Reference

> - [리액트를 다루는 기술](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791160505238&orderClick=LAG&Kc=)
