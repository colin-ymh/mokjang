'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import ModalLayout from '@/components/organisms/layout/modal-layout';
import Login from '@/components/organisms/auth/login';
import { usePageRouter } from '@/utils/router';

export default async function LoginPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = usePageRouter();

  // 로그인 상태라면 중복 렌더링을 막기 위해 null 반환
  if (user?.id) {
    router.replace('admin');
    return null;
  }

  return (
    <ModalLayout>
      <Login />
    </ModalLayout>
  );
}
