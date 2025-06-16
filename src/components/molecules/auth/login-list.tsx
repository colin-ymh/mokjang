import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AUTH, AuthApi } from '@/api/auth/auth.api';
import LoginListView from '@/components/molecules/auth/login-list.view';
import { getFormattedMobilePhone, getFormattedName } from '@/utils/format';

const LoginList = () => {
  const nextRouter = useRouter();
  const authApi = new AuthApi(false);
  const [thrownError, setThrownError] = useState<Error | null>(null);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    setName(newName);
  };

  const onChangePhone = (event: ChangeEvent<HTMLInputElement>) => {
    const newPhone = getFormattedMobilePhone(event.target.value);
    setPhone(newPhone);
  };

  const onClickItem = async (provider?: AUTH) => {
    // 외부 로그인 (OAuth)
    if (provider) {
      nextRouter.replace(authApi.getOAuth({ provider }));
      return;
    }

    // 테스트용 로그인
    try {
      await authApi
        .getTestAuth({
          provider: name,
          providerId: phone,
        })
        .then((response) => {
          // 로그인 성공 이후, 페이지 새로고침
          window.location.href = '/login';
        });
    } catch (error) {
      // setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) {
        return;
      }

      if (e.key === 'Enter') {
        onClickItem();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [name, phone]);

  const props = {
    name,
    phone,
    onChangeName,
    onChangePhone,
    onClickItem,
  };

  return (
    <>
      <LoginListView {...props} />
    </>
  );
};

export default LoginList;
