import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setChurch, setChurchId } from '@/redux/reducers/church-reducer';
import { setUser } from '@/redux/reducers/user-reducer';

import { AUTH, AuthApi } from '@/api/auth/auth.api';
import { setAuthorizationToken } from '@/api/authorize-axios';
import LoginListView from '@/components/molecules/auth/login-list.view';
import { usePageRouter } from '@/utils/router';
import { getFormattedMobilePhone, getFormattedName } from '@/utils/format';
import { useRouter } from 'next/navigation';

const LoginList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const nextRouter = useRouter();
  const router = usePageRouter();
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
    if (provider) {
      nextRouter.replace(authApi.getOAuth({ provider }));
      return;
    }

    try {
      const response = await authApi.getTestAuth({
        provider: name,
        providerId: phone,
      });

      if (response.status === 200) {
        // 가입이 안된 유저
        if (response.data?.temporal) {
          // 임시토큰 저장
          setAuthorizationToken(response.data?.temporal);
          router.replace('/login/register');
        }
        // 이미 가입된 회원인 경우
        else {
          // 액세스토큰, 리프레시토큰 저장
          setAuthorizationToken(
            response.data?.accessToken,
            response.data?.refreshToken
          );

          try {
            const userResponse = await authApi.getUser();
            const newUser = userResponse.data;
            dispatch(setUser(newUser));

            // 등록된 교회가 있는 경우
            if (newUser?.adminChurch?.id || newUser?.managingChurch?.id) {
              dispatch(setChurch(newUser.adminChurch));
              dispatch(setChurchId(newUser.adminChurch.id));
              router.replace('');
            }
            // 등록된 교회가 없는 경우
            else {
              router.replace('/church/register');
            }
          } catch (error) {
            setThrownError(
              error instanceof Error ? error : new Error(String(error))
            );
          }
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
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
