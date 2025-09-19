'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { usePageRouter } from '@mokjang/utils';
import PageLayout from '@/components/organisms/layout/page-layout';
import Login from '@/components/organisms/login/login';
import { useEffect, useMemo, useState } from 'react';
import { AuthApi } from '@/api/auth/auth.api';

export default function LoginPage() {
  const { user, initialized } = useSelector((state: RootState) => state.user);
  const router = usePageRouter();

  // API 인스턴스 재생성 방지
  const authApi = useMemo(() => new AuthApi(false), []);

  // thrownError 패턴 적용
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  useEffect(() => {
    // ✅ 초기화가 끝난 후 유저가 존재하면 홈으로 리다이렉트
    if (!initialized || user?.id) return;

    let alive = true;

    (async () => {
      try {
        const { data: isTemp } = await authApi.getIsTemporalToken();

        if (!alive) return;

        // 임시 토큰이면 가입/등록 화면으로, 아니면 홈으로
        router.replace(isTemp ? '/register' : '/');
      } catch (error) {
        // 토큰 확인 실패 시 홈으로
        if (!alive) return;
        router.replace('/');
      }
    })();

    return () => {
      alive = false;
    };
  }, [initialized, user?.id, router, authApi]);

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
