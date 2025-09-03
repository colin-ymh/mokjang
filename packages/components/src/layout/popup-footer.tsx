import React from 'react';
import { PopupFooterView } from './popup-footer.view';

type PopupFooterProps = {
  onClickCancel: () => void;
  onClickDone?: () => void;
  cancelText: string;
  doneText: string;
  cancelBackgroundColor?: string;
  doneBackgroundColor?: string;
  doneDisabled?: boolean;
};

export const PopupFooter = ({
  onClickCancel,
  onClickDone,
  cancelText,
  doneText,
  cancelBackgroundColor,
  doneBackgroundColor,
  doneDisabled,
}: PopupFooterProps) => {
  const props = {
    onClickCancel,
    onClickDone,
    cancelText,
    doneText,
    cancelBackgroundColor,
    doneBackgroundColor,
    doneDisabled,
  };
  return (
    <>
      <PopupFooterView {...props} />
    </>
  );
};
