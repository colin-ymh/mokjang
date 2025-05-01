import React from 'react';
import styled from 'styled-components';

import { GRAY, WHITE } from '@/constants/styles/color';
import Button from '@/components/atoms/common/button/button';
import { useScopedI18n } from '../../../../../locales/client';

const FooterContainer = styled.header`
  display: flex;
  height: 60px;
  flex-shrink: 0;
  width: 100%;
  background-color: ${WHITE};
  border-top: 1px solid ${GRAY.LIGHT};
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
  onClickCancel: () => void;
  onClickDone?: () => void;
  cancelText: string;
  doneText: string;
};

const PopupFooterView = ({
  onClickCancel,
  onClickDone,
  cancelText,
  doneText,
}: PopupFooterViewProps) => {
  const t_button = useScopedI18n('button');

  return (
    <FooterContainer>
      <FooterLeft></FooterLeft>

      <FooterRight>
        <Button
          text={cancelText}
          onClick={onClickCancel}
          width={80}
          height={35}
          color={GRAY.DARK}
          backgroundColor={WHITE}
          borderColor={GRAY.SEMI_LIGHT}
        />
        {onClickDone && (
          <Button
            text={doneText}
            onClick={onClickDone}
            width={80}
            height={35}
          />
        )}
      </FooterRight>
    </FooterContainer>
  );
};

export default PopupFooterView;
