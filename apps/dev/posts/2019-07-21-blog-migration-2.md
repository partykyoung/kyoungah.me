---
title: Hexo 에서 Gatsby로 블로그 마이그레이션 하기 2
date: 2019-07-21
tags: ["Gatsby"]
publish: true
---

[Hexo에서 Gatsby로 블로그 마이그레이션 작업](/etc/blog-migration/)을 계속 이어 하면서 과정을 한번 더 정리 하였다. 직접 이것 저것 원하는대로 다 커스터마이징 하려다 보니 끝이 없는 것 같다 ㅠ.

## disqus

댓글은 disqus를 사용했다. [utterances](https://github.com/utterance/utterances)도 고려해봤는데 github 아이디가 있어아만 댓글을 쓸 수 있다는 점이 단점으로 느껴져서 그냥 disqus를 계속 사용하기로 했다.

Gatsby에서 disqus를 사용하려면 gatsby-plugin-disqus 플러그인을 설치하면 된다.

### Install

```bash
yarn add gatsby-plugin-disqus
```

### gatsby-config.js

plugins에 gatsby-plugin-disqus를 추가해주자.

```js
module.exports = {
  // 생략...
  plugins: [
    // 생략...
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `kyoungah`,
      },
    },
  ],
};
```

### blogTemplate.tsx

포스트에 관련된 정보를 blogTemplate 컴포넌트에서 호출하고 있기 때문에 여기에 댓글 컴포넌트를 삽입하기로 했다. query문 호출 부분에 id를 호출 할 수 있도록 추가해주었고 gatsby-plugin-disqus의 Disqus 컴포넌트를 사용하여 아주 쉽게 댓글 영역을 추가해주었다.

```js
import React from "react";
import { graphql } from "gatsby";
import styled, { theme } from "../styledComponents";
import { Disqus } from "gatsby-plugin-disqus";

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}: any) {
  const { markdownRemark } = data; // data.markdownRemark holds our post data
  const { frontmatter, html, id } = markdownRemark;
  const disqusConfig = {
    url: `${"https://dev.kyoungah.com" + frontmatter.path}`,
    identifier: id,
    title: frontmatter.title,
  };

  return (
    <>
      {/** 포스트 컨텐츠 **/}
      <Disqus config={disqusConfig} />
    </>
  );
}

// grapthql을 이용하여 markdown에서 데이터를 가지고 온다.
export const pageQuery = graphql`
  query ($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      id
      html
      frontmatter {
        date(formatString: "YYYY년 MM월 DD일")
        description
        path
        title
      }
    }
  }
`;
```

## KaTeX

이전 블로그에서 수학 수식을 표현해주는 mathjax 라는 js 라이브러리를 사용하고 있었기 때문에 gatsby-remark-mathjax 라는 플러그인을 사용하려고 했으나 설정을 했음에도 불구하고 mathjax가 제대로 실행이 되질 않았다. 계속 방법을 찾아보다가 [KaTeX](https://katex.org/docs/supported.html)라는걸 알게되었는데 mathjax 처럼 역시 수학 수식을 표현해주는 js 라이브러리 였다. 혹시나 하는 마음에 적용해보았는데 다행히 mathjax와 문법(?)이 같애서 수학 수식이 원하는대로 출력되었다.
gatsby-remark-katex 플러그인을 사용하려면 gatsby-transformer-remark가 같이 필요한데 나처럼 markdown 작업 등을 미리 해놨으면 이미 설치가 되어 있을 것이다. 없으면 같이 설치해주면 된다.

### Install

```bash
yarn add gatsby-remark-katex katex
```

### gatsby-config.js

```js
module.exports = {
  // 생략...
  plugins: [
    // 생략...
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          // 생략 ...
          {
            resolve: `gatsby-remark-katex`,
            options: {
              // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
              strict: `ignore`,
            },
          },
        ],
      },
    },
    // 생략...
  ],
};
```

## Google Analytics

구글 애널리틱스 설정은 gatsby-plugin-google-analytics 플러그인을 사용하였다.

```bash
yarn add gatsby-plugin-google-analytics
```

```js
module.exports = {
  // 생략 ...
  plugins: [
    // 생략...
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-80236732-4",
      },
    },
  ],
};
```

## RSS

부끄럽지만 솔직히 말하자면 RSS 기능을 적극적으로 사용해본적이 없어서 생각지도 않고 있었는데 회사 슬랙에서 RSS 봇으로 기술 블로그들의 글을 공유하는걸 보고서 아 나도 추가해야겠구나 싶었다. [gatsby-plugin-feed](https://www.gatsbyjs.org/packages/gatsby-plugin-feed/)을 사용하면 RSS 기능을 쉽게 추가할 수 있다.

### Install

```markdown
yarn add gatsby-plugin-feed
```

### gatsby-config.js

여러가지 옵션들을 추가할 수 있으나 뭐가 뭔지 잘 몰라서 일단 기본으로만 설정해두었다. 추후에 필요한 부분이 있으면 옵션을 추가하여 커스터마이징 할 생각이다.

```js
module.exports = {
  // 생략 ...
  plugins: [
    // 생략...
    `gatsby-plugin-feed`,
  ],
};
```

## 남은 작업

1. 블로그 리스트 pagination 작업
2. 블로그 포스트 pagination 작업
3. 태그 페이지 작업
4. 카테고리 작업

## 마무리

블로그 마이그레이션 작업을 꽤 진행했는데도 아직 굵직굵직한 작업들이 남았다. 그리고 컴포넌트 구조나 css도 맘에 안들어서 정리도 하고 싶다. 그럼에도 불구하고 내가 원하는 입맛대로 블로그를 만들 수 있으니 블로그 마이그레이션 작업이 너무 재밌다. Gatsby로 블로그 마이그레이션 작업을 시작한게 잘 한 일이라는 생각이 든다. 포기하지말고 꾸준히 마이그레이션 작업을 하여 멋진 블로그를 만들고 싶다.
