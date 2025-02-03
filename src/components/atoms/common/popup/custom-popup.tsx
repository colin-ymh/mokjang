import React, { ReactNode, useEffect } from 'react';
import styled from 'styled-components';

import { WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';

import ExitButton from '../../../../../public/svg/cancel.svg';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContainer = styled.div<{
  width?: number;
  height?: number;
  $isPercentage?: boolean;
}>`
  display: flex;
  flex-direction: column;
  background-color: ${WHITE};
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    height: 100%;
    width: 100%;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    height: ${({ height, $isPercentage }) =>
      height ? ($isPercentage ? `${height}%` : `${height}px`) : '100%'};
    width: ${({ width, $isPercentage }) =>
      width ? ($isPercentage ? `${width}%` : `${width}px`) : '100%'};
  }
`;

const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  background-color: ${WHITE};
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  height: 50px;
  flex-shrink: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  padding-left: 10px;
`;

const HeaderRight = styled.div`
  display: flex;
  padding-right: 10px;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

type CustomPopupProps = {
  isShow: boolean;
  onClickClose: () => void;
  headerLeft?: ReactNode;
  width?: number;
  height?: number;
  isPercentage?: boolean;
  children: ReactNode;
};

const CustomPopup = ({
  isShow,
  onClickClose,
  headerLeft,
  width,
  height,
  isPercentage = false,
  children,
}: CustomPopupProps) => {
  useEffect(() => {
    // ESC 누르면 닫기
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

  if (!isShow) return null;

  return (
    <ModalOverlay>
      <ModalContainer
        width={width}
        height={height}
        $isPercentage={isPercentage}
      >
        <HeaderContainer>
          <HeaderLeft>
            <MainText>{headerLeft}</MainText>
          </HeaderLeft>
          <HeaderRight>
            <ExitButton onClick={onClickClose} />
          </HeaderRight>
        </HeaderContainer>
        <ContentContainer>{children}</ContentContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CustomPopup;
