import React from 'react';
import styled from 'styled-components';

import { GRAY, MAIN, WHITE } from '@mokjang/constants';
import { Button } from '../button';

const FooterContainer = styled.header`
  display: flex;
  height: 60px;
  flex-shrink: 0;
  width: 100%;
  background-color: ${WHITE};
  border-top: 1px solid ${GRAY.EXTRA_LIGHT};
`;

const FooterLeft = styled.div`
  display: flex;
  flex: 1;
  padding-left: 10px;
  justify-content: flex-start;
  align-items: center;
`;

const FooterRight = styled.div`
  display: flex;
  flex: 1;
  padding-right: 10px;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

type PopupFooterViewProps = {
  onClickCancel?: () => void;
  onClickDone?: () => void;
  cancelText: string;
  doneText: string;
  cancelBackgroundColor?: string;
  doneBackgroundColor?: string;
  doneDisabled?: boolean;
};

export const PopupFooterView = ({
  onClickCancel,
  onClickDone,
  cancelText,
  doneText,
  cancelBackgroundColor,
  doneBackgroundColor,
  doneDisabled,
}: PopupFooterViewProps) => {
  return (
    <FooterContainer>
      <FooterLeft></FooterLeft>

      <FooterRight>
        {onClickCancel && (
          <Button
            text={cancelText}
            onClick={onClickCancel}
            width={80}
            height={35}
            color={GRAY.DARK}
            backgroundColor={cancelBackgroundColor || WHITE}
            borderColor={GRAY.SEMI_LIGHT}
          />
        )}
        {onClickDone && (
          <Button
            text={doneText}
            onClick={onClickDone}
            backgroundColor={
              doneDisabled
                ? GRAY.SEMI_LIGHT
                : doneBackgroundColor || MAIN.DEFAULT
            }
            width={80}
            height={35}
            disabled={doneDisabled}
          />
        )}
      </FooterRight>
    </FooterContainer>
  );
};
