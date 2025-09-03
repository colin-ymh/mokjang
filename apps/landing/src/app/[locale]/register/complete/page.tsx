'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { usePageRouter } from '../../../../../../../packages/utils/src';
import PageLayout from '@/components/organisms/layout/page-layout';
import RegisterComplete from '@/components/organisms/register/register-complete';

export default function RegisterCompletePage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = usePageRouter();

  useEffect(() => {
    if (!user?.id) {
      router.replace('/');
    }
  }, [user?.id, router]);

  if (!user?.id) return null;

  return (
    <PageLayout>
      <RegisterComplete />
    </PageLayout>
  );
}
