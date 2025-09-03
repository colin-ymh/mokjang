'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ToastPopup } from './toast-popup';

export const ToastLayout = () => {
  const { isToastShown } = useSelector((state: RootState) => state.toastPopup);

  if (!isToastShown) return null;

  return <ToastPopup />;
};
