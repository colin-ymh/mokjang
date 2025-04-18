import React from 'react';
import styled from 'styled-components';

import { GRAY, WHITE } from '@/constants/styles/color';

import ExitButton from '../../../../../public/svg/chevron-left.svg';

const HeaderContainer = styled.header`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 40px;
  max-height: 40px;
  background-color: ${WHITE};
  border-bottom: 1px solid ${GRAY.LIGHT};
  // 콘텐츠보다 위로 가도록
  //z-index: 10;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex: 1;
  padding-left: 10px;
  justify-content: flex-start;
  align-items: center;
`;

const HeaderRight = styled.div`
  display: flex;
  flex: 1;
  padding-right: 10px;
  justify-content: flex-end;
  align-items: center;
`;

type PopupHeaderViewProps = {
  onClickClose: () => void;
  headerRight?: React.ReactNode;
};

const PopupHeaderView = ({
  onClickClose,
  headerRight,
}: PopupHeaderViewProps) => {
  return (
    <HeaderContainer>
      <HeaderLeft>
        <ExitButton onClick={onClickClose} />
      </HeaderLeft>

      {headerRight && <HeaderRight>{headerRight}</HeaderRight>}
    </HeaderContainer>
  );
};

export default PopupHeaderView;
