"use client";

import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { createGlobalStyle } from "styled-components";

import TranslateProvider from "@/app/[locale]/provider";
import StyledComponentsRegistry from "@/hooks/registry";

import store from "@/redux/store";
import { initializeIsWebview } from "@/redux/reducers/webview-reducer";
import { useInitializeChurch } from "@/utils/initialize";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

const GlobalStyle = createGlobalStyle`
    @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-std.css");

    html,
    body {
        margin: 0; /* 기본 margin 제거 */
        height: 100%; /* 전체 높이 설정 */
        background-color: white; /* body 배경색을 흰색으로 설정 */
        min-width: 320px; /* 화면 너비가 320px 이하로 줄어들지 않도록 설정 */
        font-family: 'Pretendard Std', monospace; /* Pretendard Std 적용 */
    }

    body > div:first-child,
    div#__next,
    div#__next > div {
        height: 100%;
    }
`;

type RootLayoutProps = {
  children?: React.ReactNode;
};

type RootLayoutPropsExtended = {
  children?: React.ReactNode;
  modal?: React.ReactNode;
};

// Provider 내부에 전역변수 initialize
const InitializeStore = () => {
  const initializeChurch = useInitializeChurch("1");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeIsWebview()); // 웹뷰 상태 초기화
    initializeChurch();
  }, [dispatch]);

  return null;
};

const RootLayout = (props: RootLayoutProps | RootLayoutPropsExtended) => {
  const { children } = {
    ...props,
  };

  return (
    <html lang="ko">
      <head>
        <meta
          name="viewport"
          content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width"
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <Provider store={store}>
            <TranslateProvider>
              <DndProvider backend={HTML5Backend}>
                <InitializeStore />
                <GlobalStyle />
                {children}
              </DndProvider>
            </TranslateProvider>
          </Provider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
