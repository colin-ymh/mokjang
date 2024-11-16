"use client";

import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";

import StyledComponentsRegistry from "@/common/styles/registry";
import store from "@/redux/store";
import { initializeIsWebview } from "@/redux/reducers/webview-reducer";
import TranslateProvider from "@/app/[locale]/provider";

type RootLayoutProps = {
  children?: React.ReactNode;
};

type RootLayoutPropsExtended = {
  children?: React.ReactNode;
  modal?: React.ReactNode;
};

// Provider 내부에서 웹뷰 초기화를 위한 컴포넌트
const WebviewInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeIsWebview()); // 웹뷰 상태 초기화
  }, [dispatch]);

  return null;
};

const RootLayout = (props: RootLayoutProps | RootLayoutPropsExtended) => {
  const { children } = {
    ...props,
  };

  return (
    <html lang="en">
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
              <WebviewInitializer /> {/* 웹뷰 초기화 컴포넌트 */}
              {children}
            </TranslateProvider>
          </Provider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
