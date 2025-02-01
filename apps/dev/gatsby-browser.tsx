import React from "react";

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    // Preconnect 설정: 폰트를 불러올 도메인에 미리 연결
    <link
      key="preconnect-googleapis"
      rel="preconnect"
      href="https://fonts.googleapis.com"
    />,
    <link
      key="preconnect-gstatic"
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />,
    // 폰트 스타일시트 로딩
    <link
      key="google-fonts-noto-sans-kr"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
    />,
    <link
      key="google-fonts-roboto"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
    />,
    <link
      key="google-fonts-fira-code"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap"
    />,
  ]);
};
