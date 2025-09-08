'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { usePageRouter } from '@mokjang/utils';
import PageLayout from '@/components/organisms/layout/page-layout';
import Setting from '@/components/organisms/setting/setting';

export default function SettingPage() {
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
      <Setting />
    </PageLayout>
  );
}
