import React from 'react';
import PopupHeaderView from '@/components/atoms/layout/header/popup-header.view';

type PopupHeaderProps = {
  onClickClose: () => void;
  headerRight?: React.ReactNode;
};

const PopupHeader = ({ onClickClose, headerRight }: PopupHeaderProps) => {
  const props = {
    onClickClose,
    headerRight,
  };
  return (
    <>
      <PopupHeaderView {...props} />
    </>
  );
};

export default PopupHeader;
