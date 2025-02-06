import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setChurch, setChurchId } from '@/redux/reducers/church-reducer';
import { setUser } from '@/redux/reducers/user-reducer';

import { AuthApi } from '@/api/auth/auth.api';
import { setAuthorizationToken } from '@/api/authorize-axios';
import LoginListView from '@/components/molecules/auth/login-list.view';
import { usePageRouter } from '@/utils/router';
import { getFormattedMobilePhone, getFormattedName } from '@/utils/format';

const LoginList = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const router = useRouter();
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

  const onClickItem = async () => {
    try {
      // router.push(authApi.getOAuth({ provider }));
      const response = await authApi.getTestAuth({
        provider: name,
        providerId: phone,
      });

      if (response.status === 200) {
        // 가입이 안된 유저
        if (response.data?.temporal) {
          // 임시토큰 저장
          setAuthorizationToken(response.data?.temporal);
          router.push('/login/register');
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
              router.push('');
            }
            // 등록된 교회가 없는 경우
            else {
              router.push('/church/register');
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
