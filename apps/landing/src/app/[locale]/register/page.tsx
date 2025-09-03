'use client';

import { useEffect, useState } from 'react';

import { usePageRouter } from '../../../../../../packages/utils/src';
import PageLayout from '@/components/organisms/layout/page-layout';
import Register from '@/components/organisms/register/register';
import { AuthApi } from '@/api/auth/auth.api';

export default function RegisterPage() {
  const authApi = new AuthApi(false);
  const router = usePageRouter();

  const [isTemporal, setIsTemporal] = useState<boolean>(false);

  const fetchTemporalToken = async () => {
    try {
      const { data: isTemp } = await authApi.getIsTemporalToken();
      if (isTemp) {
        setIsTemporal(true);
      } else {
        router.push('/');
      }
    } catch (error) {
      router.push('/');
    }
  };

  useEffect(() => {
    fetchTemporalToken();
  }, []);

  if (!isTemporal) {
    return <div></div>;
  }

  return (
    <PageLayout>
      <Register />
    </PageLayout>
  );
}
