'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { usePageRouter } from '../../../../../../../packages/utils/src';
import PageLayout from '@/components/organisms/layout/page-layout';
import SubscriptionComplete from '@/components/organisms/subscription/subscription-complete';

export default function SubscriptionCompletePage() {
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
      <SubscriptionComplete />
    </PageLayout>
  );
}
