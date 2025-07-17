'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';

const ToastLayout = () => {
  const { isToastShown } = useSelector((state: RootState) => state.toastPopup);

  if (!isToastShown) return null;

  return <ToastPopup />;
};

export default ToastLayout;
