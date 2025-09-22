'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { usePageRouter } from '@mokjang/utils';
import PageLayout from '@/components/organisms/layout/page-layout';
import Login from '@/components/organisms/login/login';
import { useMemo, useState } from 'react';
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

  // ✅ 유저 정보 없고 temporal token도 없을 때만 로그인 페이지 표시
  return (
    <PageLayout>
      <Login />
    </PageLayout>
  );
}
