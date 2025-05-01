import React from 'react';
import PopupFooterView from '@/components/atoms/layout/footer/popup-footer.view';

type PopupFooterProps = {
  onClickCancel: () => void;
  onClickDone?: () => void;
  cancelText: string;
  doneText: string;
};

const PopupFooter = ({
  onClickCancel,
  onClickDone,
  cancelText,
  doneText,
}: PopupFooterProps) => {
  const props = {
    onClickCancel,
    onClickDone,
    cancelText,
    doneText,
  };
  return (
    <>
      <PopupFooterView {...props} />
    </>
  );
};

export default PopupFooter;
