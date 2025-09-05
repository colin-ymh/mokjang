import TopView, { TopViewProps } from './top.view';
import { usePageRouter } from '@mokjang/utils';
import { SIDE_ID } from '../../../../constants/layout/header';
import { useState } from 'react';

type TopProps = {
  handleSideShow: () => void;
};

const Top = ({ handleSideShow }: TopProps) => {
  const router = usePageRouter();

  const [isNotificationOpened, setIsNotificationOpened] = useState<boolean>(false);

  const [isProfileOpened, setIsProfileOpened] = useState<boolean>(false);

  const onClickButton = (id: SIDE_ID) => {
    router.replace(`/${id}`);
  };

  const onClickNotification = () => {
    setIsNotificationOpened(true);
  };

  const onClickNotificationClose = () => {
    setIsNotificationOpened(false);
  };

  const onClickProfile = () => {
    setIsProfileOpened(true);
  };

  const onClickProfileClose = () => {
    setIsProfileOpened(false);
  };

  const props = {
    isNotificationOpened,
    isProfileOpened,
    onClickButton,
    handleSideShow,
    onClickNotification,
    onClickNotificationClose,
    onClickProfile,
    onClickProfileClose,
  } as TopViewProps;

  return (
    <>
      <TopView {...props} />
    </>
  );
};

export default Top;
