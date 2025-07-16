import React from 'react';
import PopupHeaderView from '@/components/atoms/layout/header/popup-header.view';

type PopupHeaderProps = {
  headerTitle?: string;
  headerRight?: React.ReactNode;
  onClickCancel: () => void;
  onClickDone?: () => void;
  cancelText: string;
  doneText: string;
  isHeaderBorderShown?: boolean;
};

const PopupHeader = (props: PopupHeaderProps) => {
  return (
    <>
      <PopupHeaderView {...props} />
    </>
  );
};

export default PopupHeader;
