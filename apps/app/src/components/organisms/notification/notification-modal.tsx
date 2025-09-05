import { TransparentBackground } from '@mokjang/components';
import { routeLandingPage } from '@mokjang/utils';

import NotificationModalView, {
  NotificationModalViewProps,
} from './notification-modal.view';
import React, { useState } from 'react';

type ProfileModalProps = {
  onClickClose: () => void;
};

const NotificationModal = ({ onClickClose }: ProfileModalProps) => {
  const [isZoomIn, setIsZoomIn] = useState(false);

  const onClickReadAll = () => {};

  const onClickUnread = () => {
    routeLandingPage('/donate');
  };

  const onClickZoomIn = () => {
    setIsZoomIn(true);
  };

  const onClickZoomOut = () => {
    setIsZoomIn(false);
  };

  const props = {
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
