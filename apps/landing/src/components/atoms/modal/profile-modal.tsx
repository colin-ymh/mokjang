import { TransparentBackground } from '@mokjang/components';
import { routeAppPage, usePageRouter } from '@mokjang/utils';
import { AuthApi } from '@/api/auth/auth.api';
import ProfileModalView, { ProfileModalViewProps } from './profile-modal.view';

type ProfileModalProps = {
  onClickClose: () => void;
};

const ProfileModal = ({ onClickClose }: ProfileModalProps) => {
  const router = usePageRouter();
  const authApi = new AuthApi(false);

  const onClickDonate = () => {
    router.push('/donate');
  };

  const onClickChurch = () => {
    routeAppPage('/');
  };

  const onClickSetting = () => {
    router.push('/setting');
  };

  const onClickLogout = () => {
    authApi.getLogOut();
    window.location.href = '/';
  };

  const props = {
    onClickDonate,
    onClickChurch,
    onClickSetting,
    onClickLogout,
  } as ProfileModalViewProps;

  return (
    <>
      <TransparentBackground
        isOpened={true}
        onClick={onClickClose}
        zIndex={9}
        blur={false}
      />
      <ProfileModalView {...props} />
    </>
  );
};

export default ProfileModal;
