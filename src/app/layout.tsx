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
    html,
    body {
        margin: 0;
        height: 100%;
        background-color: white;
        min-width: 320px;
        font-family: 'Pretendard Std', monospace;
    }

    body > div:first-child,
    div#__next,
    div#__next > div {
        height: 100%;
    }


    /* 스크롤바 숨기기 */
    ::-webkit-scrollbar {
        display: none; /* Webkit 브라우저에서 스크롤바 숨기기 */
    }

    /* Firefox에서 스크롤바 숨기기 */
    body {
        scrollbar-width: none; /* Firefox에서 스크롤바 너비 제거 */
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
