'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import { usePageRouter } from '../../../../../../packages/utils/src';
import PageLayout from '@/components/organisms/layout/page-layout';
import Join from '@/components/organisms/join/join';
import { useEffect } from 'react';

export default function JoinPage() {
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
      <Join />
    </PageLayout>
  );
}
