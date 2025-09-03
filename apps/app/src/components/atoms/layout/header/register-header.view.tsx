import React from 'react';
import styled from 'styled-components';

import { WHITE } from '@mokjang/constants';
import { MEDIA_MIN_WIDTH } from '@mokjang/constants';

import ExitButton from '../../../../../public/svg/cancel.svg';

const HeaderContainer = styled.header`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background-color: ${WHITE};
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 10px;

  // 데크스탑
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    position: relative;
    display: none;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  padding-left: 10px;
`;

const HeaderRight = styled.div`
  display: flex;
  padding-right: 10px;
`;

type RegisterHeaderViewProps = {
  onClickGoBack: () => void;
  // onClickDone: () => void;
};

const RegisterHeaderView = ({ onClickGoBack }: RegisterHeaderViewProps) => {
  return (
    <HeaderContainer>
      <HeaderLeft>
        <ExitButton onClick={onClickGoBack} />
      </HeaderLeft>
      <HeaderRight>
        {/*{stage !== MEMBER_REGISTER_STAGE.REQUIRED && (*/}
        {/*  <Button*/}
        {/*    text={t_button('save')}*/}
        {/*    onClick={onClickDone}*/}
        {/*    backgroundColor={WHITE}*/}
        {/*    color={isStageClear ? MAIN.DEFAULT : GRAY.DARK}*/}
        {/*    fontSize={18}*/}
        {/*    disabled={!isStageClear}*/}
        {/*  />*/}
        {/*)}*/}
      </HeaderRight>
    </HeaderContainer>
  );
};

export default RegisterHeaderView;
