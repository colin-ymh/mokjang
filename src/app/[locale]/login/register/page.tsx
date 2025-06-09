'use client';

import UserRegister from '@/components/organisms/auth/user-register';
import ModalLayout from '@/components/organisms/layout/modal-layout';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { usePageRouter } from '@/utils/router';

const UserRegisterPage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const router = usePageRouter();

  // // 로그인 상태라면 중복 렌더링을 막기 위해 null 반환
  // if (church-church-church-user?.id) {
  //   // router.replace('admin');
  //   return null;
  // }

  return (
    <ModalLayout>
      <UserRegister />
    </ModalLayout>
  );
};

export default UserRegisterPage;
