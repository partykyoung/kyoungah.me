---
title: Hexo 에서 Gatsby로 블로그 마이그레이션 하기
date: 2019-07-04
tags: ["Gatsby"]
publish: true
---

이번 주 내내 Hexo로 만든 블로그를 Gatsby로 마이그레이션 하는 작업을 했다. Hexo도 나름 편했지만 테마를 원하는 대로 새로 만들거나 커스터마이징 하기 좀 어렵다는 단점이 있었다. 그러다가 [6월 말에 갔던 컨퍼런스](/etc/gdg-frontend-endgame)에서 몇몇 연사자 분들이 Gatsby.js를 언급하셔서 관심이 생겨 한번 찾아보았다. React.js, GraphQL 등을 사용하여 만들어진 정적 HTML 생성기 였는데 이걸 사용하면 테마는 물론 블로그 자체를 원하는대로 커스터마이징 하기 쉬울 것 같아 Gatsby.js로 블로그 마이그레이션을 결심했다.

## Gatsby 프로젝트 생성

[gatsby-cli](https://www.gatsbyjs.org/docs/quick-start/)를 사용하면 아주 편리하게 gatsby 프로젝트를 생성할 수 있다.

```markdown
// 전역으로 gatsby-cli 설치
npm install -g gatsby-cli

// gatsby 프로젝트 생성
gatsby new gatsby-site

cd gatsby-site

// gatsby 개발 서버 실행
gatsby develop
```

나는 내 입맛에 맞는 테마를 만들고 싶어 기본 starter를 이용했는데 원하는 starter를 선택한 후 프로젝트를 생성할 수 도 있다. 컨퍼런스에서 Gatsby를 제일 먼저 소개해주셨던 연사자분도 [gatsby-starter-bee](https://github.com/JaeYeopHan/gatsby-starter-bee)라는 starter를 만드셨다.

## TypeScript 환경 구축하기

요즘 대세인 TypeScript을 Gatsby 프로젝트에도 적용하기로 했다. 평소 js 프로젝트에 TypeScript 환경을 설정하는 것과 비슷하다. gatsby-config.js 파일에 gatsby-plugin-typescript 플러그인만 추가해주면 된다.

TypeScript 환경을 구축하고 나니 functional Component가 제대로 작동 안하는 이슈가 있었는데 [gatsby를 2.13.8 버전으로 업데이트](https://github.com/gatsbyjs/gatsby/issues/15423)하고 나니 정상 작동 되었다.

### Install

```
yarn add typescript @types/react @types/react-dom gatsby-plugin-typescript @types/react-helmet
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "allowJs": true,
    "jsx": "react",
    "strict": true, // 엄격한 타입 검사 옵션을 활성화 한다.
    "esModuleInterop": true // import * as React 처럼 import 하는 것을 import React 이런 식으로 import 할 수 있도록 도와준다.
  }
}
```

### gatsby-config.js

```javascript
module.exports = {
  // 생략...

  plugins: [
    // 생략...
    `gatsby-plugin-typescript`,
    // 생략...
  ],
};
```

## styled-components 설정하기

[styled-component](https://www.gatsbyjs.org/docs/styled-components/)가 너무 편해서 블로그에서도 사용할 수 있도록 설정했다. 글로벌 css 역시 styled-components의 createGlobalStyle 함수를 사용하여 적용하였다.

### Install

```
yarn add gatsby-plugin-styled-components styled-components babel-plugin-styled-components
```

### gatsby-config.js

```javascript
module.exports = {
  // 생략...
  plugins: [
    // 생략...
    `gatsby-plugin-styled-components`,
    // 생략...
  ],
};
```

## markdown 설정하기

Gatsby는 데이터 소스라는 곳에서 GraphQL을 이용하여 데이터를 가지고 온다. 이 데이터 소스는 Wordpress같은 CMS 도구가 될 수도 있고 다른 정적 사이트 생성기처럼 Markdown 파일이 될 수도 있고 API 등을 통해서 다른 곳에서 가져올 수도 있다. 플러그인 시스템이 잘 되어 있어서 다양한 데이터소스에서 데이터를 가져올 수 있다.
나는 데이터 소스가 markdown 파일이 되도록 설정 했다.

```markdown
---
title: Hexo 에서 Gatsby로 블로그 마이그레이션 하기
date: 2019-07-04
description: Hexo에서 Gatsby로 블로그 마이그레이션 하는 과정을 정리하였습니다.
---
```

### Install

markdown 파일을 읽기 위해서는 gatsby-source-filesystem 플러그인이 필요하고 markdown 파일을 해석하기 위해서는 gatsby-transformer-remark 플러그인이 필요하다.

```
yarn add gatsby-source-filesystem gatsby-transformer-remark

```

### blogTeplate.tsx

markdown 파일에서 가져온 정보를 뿌려주기 위한 템플릿을 만들어주자.

```javascript
// 생략...

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}: any) {
  const { markdownRemark } = data; // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark;

  return (
    <>
      <div className="blog-post-container">
        <div className="blog-post">
          <h1>{frontmatter.title}</h1>
          <h2>{frontmatter.date}</h2>
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </>
  );
}

// grapthql을 이용하여 markdown에서 데이터를 가지고 온다.
export const pageQuery = graphql`
  query ($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "YYYY년 MM월 DD일")
        path
        title
      }
    }
  }
`;
```

### gatsby-config.js

```javascript
module.exports = {
  // 생략...

  plugins: [
    // 생략...
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/마크다운 파일이 있는 폴더명`,
      },
    },
    `gatsby-transformer-remark`,
    // 생략...
  ],
};
```

### gatsby-node.js

gatsby는 Node API를 사용하여 정적페이지를 생성한다. 이 API를 사용하기 위해서는 gatsby-node.js 파일에서 설정이 필요하다.

```javascript
const path = require(`path`);
const { createFilePath } = require("gatsby-source-filesystem");

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  const blogPostTemplate = path.resolve(`src/templates/blogTemplate.tsx`);

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    return result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: blogPostTemplate,
        context: {
          slug: node.fields.slug,
        }, // additional data can be passed via context
      });
    });
  });
};

// 페이지 slug를 만들기 위한 함수.
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });

    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
```

## code highlight 설정하기

code highlight에는 prismjs를 사용했다. 원래는 highlight.js를 사용했는데 gatsby 플러그인을 찾을 때 prismjs가 별이 좀 더 많아서 끌렸다.

```
yarn add gatsby-remark-prismjs prismjs

```

### gatsby-config.js

```javascript
module.exports = {
  // 생략...
  plugins: [
    // 생략...
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
            },
          },
          // 생략...
        ],
      },
    },
    // 생략...
  ],
};
```

### gatsby-browser.js

원하는 highlight 테마가 있으면 gatsby-browser 파일에다가 import 해주면된다.

```javascript
/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
// gatsby-browser.js
require("./src/styles/prism-atom-one-dark.css");
```

## SEO

gatsby-cli로 생성된 프로젝트를 보면 SEO 컴포넌트가 있다. markdown 파일에서 필요한 속성들을 가지고와서 SEO 컴포넌트에 뿌려주는 식으로 작업하였다. 이 SEO 컴포넌트를 위에서 만든 blogTemplate 컴포넌트에 import 해주면된다.

### SEO.tsx

```javascript
// 생략...

const SEO: React.SFC<SEOProps> = ({ description, title, url }) => {
  return (
    <Helmet title={title}>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="description" content={description} />
      <meta property="og:title" title={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
    </Helmet>
  );
};

// 생략...
```

## 배포

netlify를 사용하면 자동배포를 할 수 있다고 하는데 마이너한 이슈인것 같아서 일단 제일 마지막 작업으로 미뤘다. 일단은 아래의 명령어로 github 페이지에 배포하고 있다.

### package.json

```json
{
  // 생략...
  "scripts": {
    "deploy": "gatsby build && gh-pages -d public -b master -r https://github.com/partyKyoung/partyKyoung.github.io"
  }
  // 생략...
}
```

## 마무리

혹시 나중에 또 참고할 일이 있을까봐 이렇게 마이그레이션 과정을 정리해놓기는 했는데 gatsby 공식문서가 진짜 잘되어 있는데다 왠만한 플러그인은 다 있기 때문에 좀 막히는게 있다 싶으면 그냥 gatsby 공식 문서를 확인하는게 제일 좋은 것 같다. 개인적으로 gatsby로 블로그 마이그레이션을 하고 엄청 만족하고 있다. 익숙한 React로 되어 있어서 커스터마이징 하기가 제일 쉽다는게 한 80%는 먹고 가는 것 같다.
아직 미완성이지만 빨리 마무리까지 끝낸 후 나처럼 Gatsby로 블로그를 시작하는 분들께 조금이나마 도움이 되고 싶다.

## Reference

> - [gatsbyjs plugins](https://www.gatsbyjs.org/plugins/)
> - [정적 사이트 생성기 Gatsby](https://blog.outsider.ne.kr/1426)
> - [Getting started with Typescript on Gatsby](https://medium.com/maxime-heckel/getting-started-with-typescript-on-gatsby-8544b47c1d27)
> - [heejongahn/blog](https://github.com/heejongahn/blog)
