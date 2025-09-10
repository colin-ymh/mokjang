import React from 'react';
import { PopupHeaderView } from './popup-header.view';

type PopupHeaderProps = {
  headerTitle?: string;
  headerDescription?: string;
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
  onClickClose: () => void;
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
