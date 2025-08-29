import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginView from '@/components/organisms/login/login.view';
import { AUTH, AuthApi } from '@/api/auth/auth.api';

const Login = () => {
  const nextRouter = useRouter();
  const authApi = new AuthApi(false);
  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onClickItem = async (provider?: AUTH) => {
    // 외부 로그인 (OAuth)
    if (provider) {
      nextRouter.replace(authApi.getOAuth({ provider }));
      return;
    }
  };

  const props = {
    onClickItem,
  };

  return (
    <>
      <LoginView {...props} />
    </>
  );
};

export default Login;
