'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import MainLayout from '@/components/organisms/layout/main-layout';
import { getContent, getHeader } from '@/hooks/layout/render-layout';

const App = () => {
  const { headerId, contentId } = useSelector(
    (state: RootState) => state.layout
  );
  const { churchId } = useSelector((state: RootState) => state.church);
  const { user } = useSelector((state: RootState) => state.user);

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
