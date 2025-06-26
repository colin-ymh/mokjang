import Button from '@/components/atoms/common/button/button';
import { AuthApi } from '@/api/auth/auth.api';
import { BLACK } from '@/constants/styles/color';

const LogoutButton = () => {
  const authApi = new AuthApi(false);
  const onClickLogout = async () => {
    authApi.getLogOut();
    window.location.href = '/login';
  };

  return (
    <Button
      text={'로그아웃'}
      onClick={onClickLogout}
      backgroundColor={BLACK}
      height={30}
    />
  );
};

export default LogoutButton;
