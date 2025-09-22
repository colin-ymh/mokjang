'use client';

import React from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store';
import StyledComponentsRegistry from '../hooks/registry';
import GlobalStyle from '../components/atoms/layout/global-style';
import InitializeStore from '@/components/atoms/layout/initialize-store';
import { ToastLayout } from '@/components/atoms/popup/toast-layout';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <Provider store={store}>
        <InitializeStore>
          <GlobalStyle />
          {children}
          <Analytics />
          <SpeedInsights />
          <ToastLayout />
        </InitializeStore>
      </Provider>
    </StyledComponentsRegistry>
  );
}
