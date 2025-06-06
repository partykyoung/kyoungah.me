---
title: html 이메일 템플릿 작성하기
date: 2018-08-23 00:16:39
tags: ["HTML"]
publish: true
---

오랜만에 퍼블리싱 외주를 받았는데 이메일 템플릿을 퍼블리싱 하는 일이었다.
이메일 템플릿은 처음 퍼블리싱 해보는거라 작업 전 먼저 사전작업으로 리서치나 관련 정보들을 알아봤다.

## 리서치

먼저 내가 받은 이메일 중 몇몇 이메일을 검사해 보았다.

![aws 메일](/images/posts/html-email-template-03.png)
![구글 애널리틱스 메일](/images/posts/html-email-template-04.png)
대부분은 table로 레이아웃을 잡고 퍼블리싱을 했다.

![구글 드라이브 알림 메일](/images/posts/html-email-template-01.png)
![티스토리 메일](/images/posts/html-email-template-02.png)
평범하게 div를 사용해서 레이아웃을 잡은 이메일들도 있었다.

스타일은 전부다 인라인 스타일을 적용하고 있었다.

## 이메일 템플릿을 작성할 때 주의해야 할 점

위에서 리서치한 결과대로 검색을 해봤더니 이메일 클라이언트 템플릿을 만들 때에는 주의해야 할 것들이 많았다.

- 레이아웃은 table로 잡자.
  이메일에서 사용하는 HTML과 CSS는 웹 표준과는 거리가 멀다. 게다가 이메일 클라이언트 마다 html과 css를 다르게 해석하기 때문에 주의해야 한다. 다행이 table 코드는 대부분 적용되므로 이를 사용하는 방법이 가장 많이 쓰인다.
  맨처음 이메일 템플릿 작업을 들어가면서 에이 뭐 어때 하며 평소대로 div나 다른 태그들로 레이아웃 작업을 진행했다가 나중에 아웃룩 구버전에서 레이아웃이 다 깨지는걸 확인하고 허겁지겁 table로 레이아웃을 다 바꿨다 ㅠ.

- 인라인으로 CSS를 적어주는 것이 가장 안전하다.
  대부분의 메일 서비스 업체에서는 보안상 css 파일을 모두 제거하기 때문에 인라인 스타일로 css를 작성해주는 것이 좋다. 대신 안되는 css 요소들도 많으니 조심해야 한다. (position, background-image 등...) media query도 지원하는 곳에서만 쓸 수 있다.

## 이메일 템플릿을 작성하면서 도움을 받았던 사이트

- [HTML 이메일 템플릿 처음부터 제작하기](https://webdesign.tutsplus.com/ko/articles/build-an-html-email-template-from-scratch--webdesign-12770)
  이메일 템플릿을 작성하는 방법을 가르쳐준다. 튜토리얼 하는 식으로 한번 읽어보고 진행했었다.

- [Responsive Email Templates](https://zurb.com/playground/responsive-email-templates)
  무료 이메일 템플릿을 다운받을 수 있는 사이트이다. 이메일 템플릿 하나를 골라 다운 받은 뒤 작업하면서 많이 참고 했었는데 도움이 많이 되었다.

- [litmus](https://litmus.com/)
  작성한 템플릿을 아웃룩, 아이폰, 안드로이드 등 여러 클라이언트에서 테스트 해 볼 수 있는 웹서비스이다. 일주일 동안 무료로 사용할 수 있고 그 다음 부터는 결제를 해야한다. gmail이랑 네이버 메일에서는 작성했던 템플릿이 무너지지 않고 잘 나오길래 안심하고 있다가 litmus로 아웃룩에서 다 무너져있는 템플릿을 보고 식겁하며 새로 작업했었다.

- [CSS Inliner Tool](https://templates.mailchimp.com/resources/inline-css/)
  html이랑 style을 합쳐서 인라인 스타일 html을 만들어주는 웹사이트이다. 이 사이트 덕분에 css파일과 html 파일을 편하게 합칠 수 있었다. 대신 여러번 작업하면 제대로 결과물이 출력이 안되는 오류가 있어서 파일을 한번 합치고 새로고침 하고 또 다른 파일들을 합치는 작업을 반복했었다.

## 마무리

이메일 템플릿 퍼블리싱을 하면서 테이블로 레이아웃 짜는것이 얼마나 구리고 html5가 얼마나 좋은지 느낄 수 있었다. css도 마음대로 못쓰고 미디어쿼리가 안되는것도 정말 힘들었다 ㅠ. 다시는... 이메일...템플릿...퍼블리싱...하고 싶지....않아...
