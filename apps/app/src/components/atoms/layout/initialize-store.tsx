'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  useInitializeChurch,
  useInitializeUser,
} from '../../../utils/initialize';
import Loading from '../common/etc/loading';
import { getIsWebview } from '../../../utils/webview';
import { setIsWebview } from '../../../redux/reducers/webview-reducer';

const InitializeStore = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const initializeUser = useInitializeUser(); // memoized callback
  const initializeChurch = useInitializeChurch(); // memoized callback

  const [isLoading, setIsLoading] = useState(true);

  /** ✅ Strict Mode 재-호출 방지를 위한 플래그 */
  const didInitRef = useRef(false);

  useEffect(() => {
    /** 이미 실행했다면 넘어감 */
    if (didInitRef.current) return;
    didInitRef.current = true;

    const init = async () => {
      try {
        // (1) 웹뷰 여부 확인
        const isWebview = getIsWebview();
        dispatch(setIsWebview(isWebview));

        // (2) 유저 정보 설정 (→ church 정보 포함)
        await initializeUser();

        // (3) churchId 기준 데이터 fetch
        await initializeChurch();
      } finally {
        // (4) 초기화 완료
        setIsLoading(false);
      }
    };

    void init(); // fire-and-forget
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 의도적으로 빈 의존성 배열

  if (isLoading) return <Loading isShow={isLoading} />;

  return <>{children}</>;
};

export default InitializeStore;
