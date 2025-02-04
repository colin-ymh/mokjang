'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import MainLayout from '@/components/organisms/layout/main-layout';
import { getContent, getHeader } from '@/hooks/layout/render-layout';
import { usePageRouter } from '@/utils/router';

const App = () => {
  const router = usePageRouter();
  const { headerId, contentId } = useSelector(
    (state: RootState) => state.layout
  );
  const { churchId } = useSelector((state: RootState) => state.church);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // **로그인이 안된 상태라면 로그인 페이지로 리다이렉트**
    if (!user?.id) {
      router.push('/login');
    }
    // **churchId가 등록되지 않은 상태면 교회 등록 페이지로 리다이렉트**
    else if (!churchId) {
      router.push('/church/register');
    }
  }, [user, churchId, router]); // **의존성 배열 추가**

  // **로그인 또는 교회 등록 상태 확인 중일 때 빈 화면 표시 (렌더링 방지)**
  if (!user?.id || !churchId) {
    return null; // **렌더링을 중단하고 빈 화면 표시**
  }

  return (
    <>
      {churchId && (
        <MainLayout
          header={getHeader(headerId)}
          content={getContent(contentId)}
        />
      )}
    </>
  );
};

export default App;
