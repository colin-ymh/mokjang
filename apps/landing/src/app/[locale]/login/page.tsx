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
    // 초기화가 끝나야 로직 시작
    if (!initialized) return;

    // 1️⃣ 유저 정보가 있으면 홈으로 이동
    if (user?.id) {
      router.replace('/');
      return;
    }

    // 2️⃣ 유저 정보가 없으면 temporal token 확인
    let alive = true;
    (async () => {
      try {
        const { data: isTemp } = await authApi.getIsTemporalToken();
        if (!alive) return;

        // temporal token이 있으면 register로 이동
        if (isTemp) {
          router.replace('/register');
        }
        // 3️⃣ token이 없으면 아무 것도 하지 않음 (로그인 페이지 유지)
      } catch (error) {
        if (!alive) return;
        // 에러가 나도 로그인 페이지 유지
      }
    })();

    return () => {
      alive = false;
    };
  }, [initialized, user?.id, router, authApi]);

  // 초기화 중에는 아무 것도 렌더링하지 않음
  if (!initialized) return null;

  // ✅ 유저 정보 없고 temporal token도 없을 때만 로그인 페이지 표시
  return (
    <PageLayout>
      <Login />
    </PageLayout>
  );
}
