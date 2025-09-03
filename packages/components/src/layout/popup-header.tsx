import React from 'react';
import { PopupHeaderView } from './popup-header.view';

type PopupHeaderProps = {
  headerTitle?: string;
  headerDescription?: string;
  headerRight?: React.ReactNode;
  onClickCancel: () => void;
  onClickDone?: () => void;
  cancelText: string;
  doneText: string;
  isHeaderBorderShown?: boolean;
  height?: number;
};

export const PopupHeader = (props: PopupHeaderProps) => {
  return (
    <>
      <PopupHeaderView {...props} />
    </>
  );
};
