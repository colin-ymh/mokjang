'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import Login from '@/components/organisms/auth/login';
import ModalLayout from '@/components/organisms/layout/modal-layout';
import { usePageRouter } from '@/utils/router';

const LoginPage = () => {
  const router = usePageRouter();
  const { churchId } = useSelector((state: RootState) => state.church);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // **로그인이 된 상태라면 메인 페이지로 리다이렉트**
    if (user?.id && churchId) {
      router.push('/');
    }
    // **교회 ID가 등록되지 않았다면 교회 등록 페이지로 리다이렉트**
    else if (user?.id && !churchId) {
      router.push('/church/register');
    }
  }, [user, churchId, router]);

  // **로그인 중이거나 리다이렉트 상태일 때는 빈 화면을 반환하여 렌더링 방지**
  if (user?.id) {
    return null; // 리다이렉트 중일 때 화면 렌더링 방지
  }

  return (
    <ModalLayout>
      <Login />
    </ModalLayout>
  );
};

export default LoginPage;
