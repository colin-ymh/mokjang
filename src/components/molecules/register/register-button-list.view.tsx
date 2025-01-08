import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import Button from '@/components/atoms/common/button/button';
import { BLACK, GRAY, MAIN, WHITE } from '@/constants/styles/color';
import {
  BLANK,
  MEMBER_REGISTER_STAGE,
} from '@/constants/constant';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';

import GoBackButton from '../../../../public/svg/chevron-left.svg';
import { useScopedI18n } from '../../../../locales/client';

const ButtonListContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const LeftButtonContainer = styled.div`
  display: flex;
  height: 50px;
  flex: 1;
  transition: all 0.3s ease;
`;

const RightButtonContainer = styled.div<{ $flex: number }>`
  display: flex;
  height: 50px;
  flex: ${({ $flex }) => $flex};
  transition: all 0.3s ease;
`;

type RegisterButtonListViewProps = {
  onClickLeft: () => void;
  onClickRight: () => void;
  getRightButtonTitle: () => string;
  isToastShow: boolean;
  setIsToastShow: Dispatch<SetStateAction<boolean>>;
};

const RegisterButtonListView = ({
  onClickLeft,
  onClickRight,
  getRightButtonTitle,
  isToastShow,
  setIsToastShow,
}: RegisterButtonListViewProps) => {
  const { stage, isStageClear } = useSelector(
    (state: RootState) => state.memberRegister
  );
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');

  return (
    <ButtonListContainer>
      <LeftButtonContainer>
        <Button
          text={
            stage === MEMBER_REGISTER_STAGE.REQUIRED
              ? t_button('invite')
              : BLANK
          }
          disabled={!isStageClear}
          backgroundColor={isStageClear ? BLACK : GRAY.DEFAULT}
          onClick={onClickLeft}
          isShadow={true}
          borderRadius={0}
        >
          {stage !== MEMBER_REGISTER_STAGE.REQUIRED && (
            <GoBackButton stroke={WHITE} />
          )}
        </Button>
      </LeftButtonContainer>
      <RightButtonContainer
        $flex={stage === MEMBER_REGISTER_STAGE.REQUIRED ? 1 : 6}
      >
        <Button
          text={getRightButtonTitle()}
          disabled={!isStageClear}
          backgroundColor={isStageClear ? MAIN.DEFAULT : GRAY.DEFAULT}
          onClick={onClickRight}
          isShadow={true}
          borderRadius={0}
        />
      </RightButtonContainer>
      {isToastShow && (
        <ToastPopup
          setIsShow={setIsToastShow}
          isDeletable={true}
          text={t_popup('registerSuccess')}
        />
      )}
    </ButtonListContainer>
  );
};

export default RegisterButtonListView;
