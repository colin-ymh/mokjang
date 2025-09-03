'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import ModalLayout from '../../../../components/organisms/layout/modal-layout';

import { usePageRouter } from '@mokjang/utils';
import ChurchInit from '@/components/organisms/church/church-init';

export default function ChurchInitPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = usePageRouter();

  useEffect(() => {
    if (!user?.id) {
      router.replace('/main');
    }
  }, [user?.id, router]);

  // 로그인된 상태면 로그인 페이지는 표시하지 않음
  if (!user?.id) return null;

  return (
    <ModalLayout>
      <ChurchInit />
    </ModalLayout>
  );
}
