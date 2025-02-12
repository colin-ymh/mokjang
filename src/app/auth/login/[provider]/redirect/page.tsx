'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthorizationToken } from '@/api/authorize-axios';

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code'); // query(?code=...)로부터 값을 얻음

  useEffect(() => {
    if (code) {
      setAuthorizationToken(code);
      // 이후 로직 (예: 로컬스토리지 저장, API 호출 등)
      router.replace('/login/register');
      console.log('code :', code);
    }
  }, [code, router]);

  return <div>{'hello'}</div>;
}
