import TopView, { TopViewProps } from './top.view';
import { usePageRouter } from '@mokjang/utils';
import { SIDE_ID } from '@/constants/layout/header';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchNotificationCount } from '@/redux/reducers/notification-reducer';
import { NOTIFICATION_DOMAIN } from '@mokjang/models';
import { closeModal } from '@/redux/reducers/modal-reducer';

type TopProps = {};

const Top = ({}: TopProps) => {
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

  const handleSideShow = () => {
    if (typeof window !== 'undefined') {
      const prev = localStorage.getItem('isSideShown');
      const next = prev === 'false' ? 'true' : 'false';

      localStorage.setItem('isSideShown', next);
      // storage 이벤트를 강제로 발생시켜 UI 반영하게 함
      window.dispatchEvent(new Event('storage'));
    }
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
