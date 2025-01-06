'use client';

import Login from '@/components/organisms/auth/login';
import ModalLayout from '@/components/organisms/layout/modal-layout';

const LoginPage = () => {
  return (
    <ModalLayout>
      <Login />
    </ModalLayout>
  );
};

export default LoginPage;
