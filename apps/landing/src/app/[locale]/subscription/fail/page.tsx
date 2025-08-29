'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { usePageRouter } from '@mokjang/utils';
import PageLayout from '@/components/organisms/layout/page-layout';
import SubscriptionFail from '@/components/organisms/subscription/subscription-fail';

export default function SubscriptionFailPage() {
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
      <SubscriptionFail />
    </PageLayout>
  );
}
