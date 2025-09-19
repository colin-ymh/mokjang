'use client';

import PageLayout from '@/components/organisms/layout/page-layout';
import Main from '@/components/organisms/main/main';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const MainPage = () => {
  const { initialized } = useSelector((state: RootState) => state.user);

  // 초기화 전에는 아무것도 렌더링하지 않거나 로딩 표시
  if (!initialized) return null; // or <Spinner />

  return (
    <>
      <PageLayout>
        <Main />
      </PageLayout>
    </>
  );
};

export default MainPage;
