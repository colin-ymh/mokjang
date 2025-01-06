'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import MainLayout from '@/components/organisms/layout/main-layout';
import { getContent, getHeader } from '@/hooks/layout/render-layout';

const App = () => {
  const { headerId, contentId } = useSelector(
    (state: RootState) => state.layout
  );
  return (
    <>
      <MainLayout
        header={getHeader(headerId)}
        content={getContent(contentId)}
      />
    </>
  );
};

export default App;
