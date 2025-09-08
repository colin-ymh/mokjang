'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { usePageRouter } from '@mokjang/utils';
import PageLayout from '@/components/organisms/layout/page-layout';
import Login from '@/components/organisms/login/login';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = usePageRouter();

  useEffect(() => {
    if (user?.id) {
      router.replace('/');
    }
  }, [user?.id, router]);

  // 로그인된 상태면 로그인 페이지는 표시하지 않음
  if (user?.id) return null;

  return (
    <PageLayout>
      <Login />
    </PageLayout>
  );
}
