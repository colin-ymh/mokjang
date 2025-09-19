'use client';

import React from 'react';
import { Provider } from 'react-redux';
import StyledComponentsRegistry from '../hooks/registry';

import store from '../redux/store';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill/dist/quill.snow.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import InitializeStore from '../components/atoms/layout/initialize-store';
import GlobalStyle from '../components/atoms/layout/global-style';
import { CustomDragLayer } from '../vendor/dnd/custom-drag-layer';
import CustomWidgetDragLayer from '../vendor/dnd/custom-widget-drag-layer';
import ToastLayout from '../components/atoms/common/popup/toast-layout';
import CustomTableHeaderDragLayer from '../vendor/dnd/custom-table-header-drag-layer';
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
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
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
                {/* 토스트 팝업 */}
                <ToastLayout />

                {/* 드래그 레이어 */}
                <CustomDragLayer />
                <CustomWidgetDragLayer />
                <CustomTableHeaderDragLayer />

                <Analytics />
                <SpeedInsights />
              </DndProvider>
            </InitializeStore>
          </Provider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
