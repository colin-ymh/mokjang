import TopView, { TopViewProps } from './top.view';
import { usePageRouter } from '@mokjang/utils';
import { SIDE_ID } from '@/constants/layout/header';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchNotificationCount } from '@/redux/reducers/notification-reducer';
import { NOTIFICATION_DOMAIN } from '@mokjang/models';
import { closeModal } from '@/redux/reducers/modal-reducer';

type TopProps = {
  handleSideShow: () => void;
};

const Top = ({ handleSideShow }: TopProps) => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = usePageRouter();

  const modal = useSelector((state: RootState) => state.modal);

  const [isNotificationOpened, setIsNotificationOpened] =
    useState<boolean>(false);

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
    dispatch(closeModal());
  };

  useEffect(() => {
    dispatch(fetchNotificationCount());
  }, [user.id]);

  useEffect(() => {
    if (!modal.open || modal.type !== NOTIFICATION_DOMAIN.PERMISSION) return;

    (async () => {
      setIsProfileOpened(true);
    })();
  }, [modal.open, modal.type]);

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
