'use client';

import React from 'react';
import { Provider } from 'react-redux';
import StyledComponentsRegistry from '../hooks/registry';

import store from '../redux/store';

import GlobalStyle from '../components/atoms/layout/global-style';
import InitializeStore from '@/components/atoms/layout/initialize-store';
import { ToastLayout } from '@/components/atoms/popup/toast-layout';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

type RootLayoutProps = {
  children?: React.ReactNode;
};

type RootLayoutPropsExtended = {
  children?: React.ReactNode;
  modal?: React.ReactNode;
};

const RootLayout = (props: RootLayoutProps | RootLayoutPropsExtended) => {
  const { children } = {
    ...props,
  };

  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body>
        {/* SSR style 렌더링 */}
        <StyledComponentsRegistry>
          {/* Redux */}
          <Provider store={store}>
            {/* 초기 전역 상태 설정 */}
            <InitializeStore>
              {/* 전역 스타일 적용 */}
              <GlobalStyle />

              {/* 실제 페이지 렌더링 */}

              {children}

              <Analytics />
              <SpeedInsights />
              {/* 토스트 팝업 */}
              <ToastLayout />
            </InitializeStore>
          </Provider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
