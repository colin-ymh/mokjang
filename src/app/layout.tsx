"use client";

import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { createGlobalStyle } from "styled-components";

import TranslateProvider from "@/app/[locale]/provider";
import StyledComponentsRegistry from "@/hooks/registry";

import store from "@/redux/store";
import { initializeIsWebview } from "@/redux/reducers/webview-reducer";
import { useChangeLocale } from "../../locales/client";
import { LOCALE } from "@/constants/state/locale";

const GlobalStyle = createGlobalStyle`
    html,
    body {
        margin: 0; /* 기본 margin 제거 */
        height: 100%; /* 전체 높이 설정 */
        background-color: white; /* body 배경색을 흰색으로 설정 */
        min-width: 320px; /* 화면 너비가 320px 이하로 줄어들지 않도록 설정 */
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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeIsWebview()); // 웹뷰 상태 초기화
  }, [dispatch]);

  return null;
};

const RootLayout = (props: RootLayoutProps | RootLayoutPropsExtended) => {
  const changeLocale = useChangeLocale();

  // useEffect(() => {
  //   const temporalLocale = (
  //     navigator.language || Intl.DateTimeFormat().resolvedOptions().locale
  //   ).slice(0, 2);
  //
  //   let locale;
  //
  //   if (!(temporalLocale in LOCALE)) {
  //     locale = LOCALE.KO;
  //   } else {
  //     locale = temporalLocale as LOCALE;
  //   }
  //
  //   console.log(locale);
  //
  //   changeLocale(locale);
  // }, []);

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
              <InitializeStore />
              <GlobalStyle />
              {children}
            </TranslateProvider>
          </Provider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
