import React from 'react';
import PopupHeaderView from './popup-header.view';

type PopupHeaderProps = {
  headerTitle?: string;
  headerDescription?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  onClickCancel: () => void;
  onClickDone?: () => void;
  cancelText: string;
  doneText: string;
  isHeaderBorderShown?: boolean;
  height?: number;
};

const PopupHeader = (props: PopupHeaderProps) => {
  return (
    <>
      <PopupHeaderView {...props} />
    </>
  );
};

export default PopupHeader;
