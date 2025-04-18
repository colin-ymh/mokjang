'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { createGlobalStyle } from 'styled-components';

import TranslateProvider from '@/app/[locale]/provider';
import StyledComponentsRegistry from '@/hooks/registry';

import store from '@/redux/store';
import { initializeIsWebview } from '@/redux/reducers/webview-reducer';
import { useInitializeChurch, useInitializeUser } from '@/utils/initialize';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import 'react-datepicker/dist/react-datepicker.css';

const GlobalStyle = createGlobalStyle`
    html,
    body {
        margin: 0;
        height: 100%;
        background-color: white;
        min-width: 320px;
        font-family: 'Noto Sans KR', monospace;
        touch-action: none;
        overscroll-behavior: none;

        -webkit-tap-highlight-color: transparent;
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
  const initializeUser = useInitializeUser();
  const initializeChurch = useInitializeChurch();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeIsWebview()); // 웹뷰 상태 초기화
    initializeChurch();
    initializeUser();
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
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
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
