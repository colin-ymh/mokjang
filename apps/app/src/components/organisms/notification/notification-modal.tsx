import { TransparentBackground } from '@mokjang/components';

import NotificationModalView, {
  NotificationModalViewProps,
} from './notification-modal.view';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchNotificationCount,
  fetchNotifications,
  resetNotifications,
  setUnread,
} from '@/redux/reducers/notification-reducer';
import { NotificationApi } from '@/api/notification/notification.api';

type ProfileModalProps = {
  onClickClose: () => void;
};

const NotificationModal = ({ onClickClose }: ProfileModalProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const notificationApi = new NotificationApi();

  const [isZoomIn, setIsZoomIn] = useState(false);

  const { loading, hasMore, unread } = useSelector(
    (s: RootState) => s.notification
  );

  const onClickReadAll = () => {
    notificationApi.readAll().then(() => {
      dispatch(resetNotifications());
      dispatch(fetchNotifications());
      dispatch(fetchNotificationCount());
    });
  };

  const onClickUnread = () => {
    dispatch(setUnread(!unread));
  };

  const onClickZoomIn = () => setIsZoomIn(true);
  const onClickZoomOut = () => setIsZoomIn(false);

  // 최초 로딩
  useEffect(() => {
    dispatch(resetNotifications());
    dispatch(fetchNotifications());
  }, [dispatch, unread]);

  // ✅ 스크롤 이벤트 핸들러
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (!el) return;
      const { scrollTop, clientHeight, scrollHeight } = el;

      const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
      if (isBottom && !loading && hasMore) {
        dispatch(fetchNotifications());
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [dispatch, loading, hasMore, unread]);

  const props = {
    scrollRef,
    isZoomIn,
    onClickClose,
    onClickReadAll,
    onClickUnread,
    onClickZoomIn,
    onClickZoomOut,
  } as NotificationModalViewProps;

  return (
    <>
      <TransparentBackground
        isOpened={true}
        onClick={onClickClose}
        zIndex={9}
        blur={false}
      />
      <NotificationModalView {...props} />
    </>
  );
};

export default NotificationModal;
