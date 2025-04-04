---
title: props
date: 2018-09-28 11:28:25
tags: ["React"]
publish: true
---

## props

props는 Component 속성을 설정할 때 사용하는 요소이다. Component는 props를 받고 props의 값에 따라 다르게 렌더링 하거나 작동할 수 있다.
PropTypes 속성의 종류는 [React 공식 문서](https://reactjs.org/docs/typechecking-with-proptypes.html)에서 확인할 수 있다.

#### 부모 컴포넌트

```js
import React, { Component } from "react";

import Child from "./Child";

class Parent extends Component {
  render() {
    return <Child singer="Nell" song="Home" />;
  }
}

export default Parent;
```

props값은 해당 컴포넌트를 불러와 사용하는 부모 컴포넌트에서만 설정할 수 있다.

#### 자식 컴포넌트

```js
// 자식 컴포넌트
import React, { Component } from "react";

class Child extends Component {
  render() {
    const { singer, song } = this.props;

    return (
      <div>
        지금 듣고 있는 노래는 {singer}의 {song}입니다.
      </div>
    );
  }
}

export default Child;
```

props에 접근할 때는 this 키워드를 사용하여 접근한다.

![실행결과](/images/posts/reactjs-props-1.png)

부모 Component에서 자식 Component로 전달되며 받아온 props는 수정할 수 없다.

![Object.isFrozen 메소드로 동결되어 있는것을 확인할 수 있다. props값을 바꾸려고 하면 에러가 난다.](/images/posts/reactjs-props-2.png)

### propTypes

```js
import React, { Component } from "react";
import PropTypes from "prop-types";

class Child extends Component {
  // ... 생략
}

Child.propTypes = {
  singer: PropTypes.string,
  song: PropTypes.string.isRequired, // 필수적으로 존재해야 한다.
};

export default Child;
```

컴포넌트의 필수 props를 지정하거나 props 타입을 지정할 때는 propTypes를 사용한다. propTypes를 지정하려면 **prop-types** 모듈이 필요하다.
필수 props를 지정하고 싶을 땐 propTypes를 설정할 때 isRequired를 사용하면 된다.

```js
export default class Parent extends Component {
  render() {
    return <Child singer={123} song="Home" />;
  }
}
```

![잘못된 타입으로 props를 넘겨줘 보았다.](/images/posts/reactjs-props-3.png)

props의 타입을 propTypes에서 설정한 타입과 다른 타입으로 넘겨주면 렌더링은 되나 개발자 도구에 오류 메시지가 출력된다.

```js
export default class Parent extends Component {
  render() {
    return <Child singer="Nell" />;
  }
}
```

![필수 props를 제외해 보았다.](/frontend/reactjs-props-4.png)
필수 props가 빠졌을 때도 렌더링은 되나 개발자 도구에 오류 메시지가 출력된다.

### defaultProps

```js
import React, { Component } from "react";
import PropTypes from "prop-types";

class Child extends Component {
  // ... 생략
}

Child.propTypes = {
  singer: PropTypes.string,
  song: PropTypes.string.isRequired,
};

Child.defaultProps = {
  singer: "Hoobastank",
  song: "Without A Fight",
};

export default Child;
```

defaultProps를 사용해서 prop의 기본 값을 설정할 수 있다. defaultProps는 prop-types 모듈이 필요 없다.

```js
export default class Parent extends Component {
  render() {
    return <Child />;
  }
}
```

![defaultProps 적용](/images/posts/reactjs-props-5.png)
props를 지정해주지 않으면 defaultProps에 있는 기본 값이 적용된다.

### transform-class-properties

```js
import React, { Component } from "react";
import PropTypes from "prop-types";

class Child extends Component {
  static propTypes = {
    singer: PropTypes.string,
    song: PropTypes.string.isRequired,
  };

  static defaultProps = {
    singer: "Hoobastank",
    song: "Without A Fight",
  };

  render() {
    const { singer, song } = this.props;

    return (
      <div>
        지금 듣고 있는 노래는 {singer}의 {song}입니다.
      </div>
    );
  }
}

export default Child;
```

propTypes, defaulProps를 클래스 내부에서 정의할 수도 있다. 이 문법을 사용하려면 transform-class-properties babel 플러그인이 필요한데 create-react-app으로 생성한 프로젝트는 기본적으로 적용되어 있기 때문에 따로 설정할 필요가 없다.

### typescript

typeScript를 사용하여 props에 타입을 줘보자.

```js
import * as React from "react";

interface ChildProps {
  singer: string;
  song: string;
}

interface ChildState {}

class Child extends React.Component<ChildProps, ChildState> {
  static defaultProps = {
    singer: "Hoobastank",
    song: "Without A Fight",
  };

  render() {
    const { singer, song } = this.props;

    return (
      <div>
        지금 듣고 있는 노래는 {singer}의 {song}입니다.
      </div>
    );
  }
}

export default Child;
```

![잘못된 타입을 지정했더니 렌더링 조차 되지 않고 오류를 출력한다.](/images/posts/reactjs-props-6.png)

## Reference

> - [리액트를 다루는 기술](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791160505238&orderClick=LAG&Kc=)
