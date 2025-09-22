'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { IS_PRODUCTION, usePageRouter } from '@mokjang/utils';
import ModalLayout from '@/components/organisms/layout/modal-layout';
import Login from '@/components/organisms/auth/login';

export default function LoginPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = usePageRouter();

  router.replace('/');

  useEffect(() => {
    if (user?.id) {
      router.replace('/main'); // ✅ redirect는 useEffect 내부에서
    }
  }, [user?.id, router]);

  // 로그인된 상태면 로그인 페이지는 표시하지 않음
  if (user?.id) return null;

  if (IS_PRODUCTION) return null;

  return (
    <ModalLayout>
      <Login />
    </ModalLayout>
  );
}
