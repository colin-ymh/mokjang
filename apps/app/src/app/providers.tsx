'use client';

import React from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store';

import StyledComponentsRegistry from '../hooks/registry';
import InitializeStore from '../components/atoms/layout/initialize-store';
import GlobalStyle from '../components/atoms/layout/global-style';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill/dist/quill.snow.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { CustomDragLayer } from '../vendor/dnd/custom-drag-layer';
import CustomWidgetDragLayer from '../vendor/dnd/custom-widget-drag-layer';
import CustomTableHeaderDragLayer from '../vendor/dnd/custom-table-header-drag-layer';
import ToastLayout from '../components/atoms/common/popup/toast-layout';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <Provider store={store}>
        <InitializeStore>
          <DndProvider backend={HTML5Backend}>
            <GlobalStyle />
            {children}

            {/* 토스트/드래그 레이어/분석 */}
            <ToastLayout />
            <CustomDragLayer />
            <CustomWidgetDragLayer />
            <CustomTableHeaderDragLayer />
            <Analytics />
            <SpeedInsights />
          </DndProvider>
        </InitializeStore>
      </Provider>
    </StyledComponentsRegistry>
  );
}
