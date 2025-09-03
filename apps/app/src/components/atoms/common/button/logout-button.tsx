import { Button } from '@mokjang/components';
import { AuthApi } from '@/api/auth/auth.api';
import { BLACK } from '@mokjang/constants';

const LogoutButton = ({ width }: { width?: number }) => {
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
      width={width}
    />
  );
};

export default LogoutButton;
