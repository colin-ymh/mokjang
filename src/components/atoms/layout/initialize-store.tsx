'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useInitializeChurch, useInitializeUser } from '@/utils/initialize';
import Loading from '@/components/atoms/common/etc/loading';
import { getIsWebview } from '@/utils/webview';
import { setIsWebview } from '@/redux/reducers/webview-reducer';

const InitializeStore = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const initializeUser = useInitializeUser();
  const initializeChurch = useInitializeChurch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        // (1) 웹뷰 여부 확인
        const isWebview = getIsWebview();
        dispatch(setIsWebview(isWebview));
        // (2) 유저 정보 설정 (→ church 정보 포함)
        await initializeUser();
        // (3) churchId 기준 데이터 fetch
        await initializeChurch();
      } finally {
        setIsLoading(false); // (4) 초기화 완료
      }
    };

    initialize();
  }, [dispatch, initializeUser, initializeChurch]);

  if (isLoading) return <Loading isShow={isLoading} />; // 또는 <Loading />

  return <>{children}</>;
};

export default InitializeStore;
