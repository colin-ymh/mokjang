'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { usePageRouter } from '@mokjang/utils';
import PageLayout from '@/components/organisms/layout/page-layout';
import Login from '@/components/organisms/login/login';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, initialized } = useSelector((state: RootState) => state.user);
  const router = usePageRouter();

  useEffect(() => {
    // ✅ 초기화가 끝난 후 유저가 존재하면 홈으로 리다이렉트
    if (initialized && user?.id) {
      router.replace('/');
    }
  }, [initialized, user?.id, router]);

  // 초기화가 끝나기 전에는 아무 것도 렌더링하지 않음 (또는 로딩 화면)
  if (!initialized) return null;

  // 로그인된 상태라면 화면 렌더링 안 함 (리다이렉트 직전)
  if (user?.id) return null;

  return (
    <PageLayout>
      <Login />
    </PageLayout>
  );
}
