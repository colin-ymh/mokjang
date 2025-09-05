'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { usePageRouter } from '@mokjang/utils';
import PageLayout from '@/components/organisms/layout/page-layout';
import Setting from '@/components/organisms/setting/setting';

export default function SettingPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = usePageRouter();
  //
  // console.log(user);
  // useEffect(() => {
  //   if (!user?.id) {
  //     router.replace('/');
  //   }
  // }, [user?.id, router]);
  //
  // // 로그인된 상태면 로그인 페이지는 표시하지 않음
  // if (!user?.id) return null;

  return (
    <PageLayout>
      <Setting />
    </PageLayout>
  );
}
