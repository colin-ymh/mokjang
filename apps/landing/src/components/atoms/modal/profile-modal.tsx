import { TransparentBackground } from '@mokjang/components';
import { routeAppPage, usePageRouter } from '@mokjang/utils';
import { AuthApi } from '@/api/auth/auth.api';
import ProfileModalView, { ProfileModalViewProps } from './profile-modal.view';
import { DESTRUCTIVE, STATUS } from '@mokjang/constants';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@mokjang/app/src/redux/reducers/toast-popup-reducer';
import { JoinApi } from '@/api/join/join.api';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useScopedI18n } from '../../../../locales/client';

type ProfileModalProps = {
  onClickClose: () => void;
};

const ProfileModal = ({ onClickClose }: ProfileModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const t_popup = useScopedI18n('popup');
  const router = usePageRouter();
  const joinApi = new JoinApi(false);
  const authApi = new AuthApi(false);

  const onClickDonate = () => {
    router.push('/donate');
  };

  const onClickChurch = () => {
    routeAppPage('/main');
  };

  const onClickCreateChurch = async () => {
    const response = await joinApi.getJoinRequests();

    const requests = response.data;

    if (requests && requests.length > 0) {
      const lastRequest = requests[0];
      if (lastRequest?.status === STATUS.PENDING) {
        dispatch(setToastText(t_popup('joinRequestExist')));
        dispatch(setIsToastShown(true));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        return;
      }
    }

    routeAppPage('/church/register');
  };

  const onClickSetting = () => {
    router.push('/setting');
  };

  const onClickLogout = async () => {
    await authApi.getLogOut();
    window.location.href = '/';
  };

  const props = {
    onClickDonate,
    onClickChurch,
    onClickCreateChurch,
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
