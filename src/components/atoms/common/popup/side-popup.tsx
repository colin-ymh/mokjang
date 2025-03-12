import React, { ReactNode, useEffect } from 'react';
import styled from 'styled-components';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { MEDIA_MAX_WIDTH } from '@/constants/constant';

import ExitButton from '../../../../../public/svg/cancel.svg';

const SidePanel = styled.div<{ isShow: boolean; width: number }>`
  position: fixed;
  top: 0;
  right: ${({ isShow }) => (isShow ? '0' : '-100%')}; /* 기본적으로 숨김 */
  height: 100%;
  width: ${({ width }) => `${width}px`};
  background-color: ${WHITE};
  transition: right 0.3s ease-in-out; /* 슬라이드 애니메이션 */
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${GRAY.LIGHT};

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    height: 100%;
    width: 100%;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${WHITE};
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderRight = styled.div`
  display: flex;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  //padding: 15px;
`;

type SidePopupProps = {
  isShow: boolean;
  onClickClose: () => void;
  headerLeft?: ReactNode;
  width?: number;
  children: ReactNode;
};

const SidePopup = ({
  isShow,
  onClickClose,
  headerLeft,
  width = 670,
  children,
}: SidePopupProps) => {
  useEffect(() => {
    // ESC 키 누르면 닫기
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClickClose();
      }
    };

    if (isShow) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isShow, onClickClose]);

  return (
    <SidePanel
      isShow={isShow}
      width={width}
      onClick={(e) => e.stopPropagation()}
    >
      <HeaderContainer>
        <HeaderLeft>
          <MainText>{headerLeft}</MainText>
        </HeaderLeft>
        <HeaderRight onClick={onClickClose}>
          <ExitButton />
        </HeaderRight>
      </HeaderContainer>
      <ContentContainer>{children}</ContentContainer>
    </SidePanel>
  );
};

export default SidePopup;
