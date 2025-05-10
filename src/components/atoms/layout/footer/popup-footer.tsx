import React from 'react';
import PopupFooterView from '@/components/atoms/layout/footer/popup-footer.view';

type PopupFooterProps = {
  onClickCancel: () => void;
  onClickDone?: () => void;
  cancelText: string;
  doneText: string;
  cancelBackgroundColor?: string;
  doneBackgroundColor?: string;
};

const PopupFooter = ({
  onClickCancel,
  onClickDone,
  cancelText,
  doneText,
  cancelBackgroundColor,
  doneBackgroundColor,
}: PopupFooterProps) => {
  const props = {
    onClickCancel,
    onClickDone,
    cancelText,
    doneText,
    cancelBackgroundColor,
    doneBackgroundColor,
  };
  return (
    <>
      <PopupFooterView {...props} />
    </>
  );
};

export default PopupFooter;
