import { TransparentBackground } from '@mokjang/components';
import { routeLandingPage } from '@mokjang/utils';

import NotificationModalView, {
  NotificationModalViewProps,
} from './notification-modal.view';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchNotifications,
  resetNotifications,
} from '@/redux/reducers/notification-reducer';

type ProfileModalProps = {
  onClickClose: () => void;
};

const NotificationModal = ({ onClickClose }: ProfileModalProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [isZoomIn, setIsZoomIn] = useState(false);

  // ✅ redux 상태 읽기
  const { loading, hasMore } = useSelector((s: RootState) => s.notification);

  const onClickReadAll = () => {};

  const onClickUnread = () => {
    routeLandingPage('/donate');
  };

  const onClickZoomIn = () => setIsZoomIn(true);
  const onClickZoomOut = () => setIsZoomIn(false);

  // 최초 로딩
  useEffect(() => {
    dispatch(resetNotifications());
    dispatch(fetchNotifications());
  }, [dispatch]);

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
  }, [dispatch, loading, hasMore]);

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
