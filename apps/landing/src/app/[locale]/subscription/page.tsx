'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { usePageRouter } from '@mokjang/utils';
import PageLayout from '@/components/organisms/layout/page-layout';
import Subscription from '@/components/organisms/subscription/subscription';
import { useEffect } from 'react';

export default function SubscriptionPage() {
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
      <Subscription />
    </PageLayout>
  );
}
