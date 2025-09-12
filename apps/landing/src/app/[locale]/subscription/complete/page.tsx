'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { usePageRouter } from '../../../../../../../packages/utils/src';
import PageLayout from '@/components/organisms/layout/page-layout';
import SubscriptionComplete from '@/components/organisms/subscription/subscription-complete';

export default function SubscriptionCompletePage() {
  const { user, initialized } = useSelector((state: RootState) => state.user);
  const router = usePageRouter();

  useEffect(() => {
    // 초기화가 끝났는데 유저가 없으면 보호 라우트 → 홈으로
    if (initialized && !user?.id) {
      router.replace('/');
    }
  }, [initialized, user?.id, router]);

  // 초기화 전에는 아무것도 렌더링하지 않거나 로딩 표시
  if (!initialized) return null; // or <Spinner />

  // 초기화가 끝났고 유저가 없으면 리다이렉트 직전 상태 → 렌더링 스킵
  if (!user?.id) return null;

  return (
    <PageLayout>
      <SubscriptionComplete />
    </PageLayout>
  );
}
