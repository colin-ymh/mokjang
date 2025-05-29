'use client';

import React from 'react';
import { Provider } from 'react-redux';
import StyledComponentsRegistry from '@/hooks/registry';

import store from '@/redux/store';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill/dist/quill.snow.css';
import InitializeStore from '@/components/atoms/layout/initialize-store';
import GlobalStyle from '@/components/atoms/layout/global-style';

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
        {/* SSR style 렌더링 */}
        <StyledComponentsRegistry>
          {/* Redux */}
          <Provider store={store}>
            {/* 초기 전역 상태 설정 */}
            <InitializeStore>
              {/* Drag And Drop */}
              <DndProvider backend={HTML5Backend}>
                {/* 전역 스타일 적용 */}
                <GlobalStyle />
                {/* 실제 페이지 렌더링 */}
                {children}
              </DndProvider>
            </InitializeStore>
          </Provider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
