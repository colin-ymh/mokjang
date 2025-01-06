'use client';

import UserRegister from '@/components/organisms/auth/user-register';
import ModalLayout from '@/components/organisms/layout/modal-layout';

const UserRegisterPage = () => {
  return (
    <ModalLayout>
      <UserRegister />
    </ModalLayout>
  );
};

export default UserRegisterPage;
