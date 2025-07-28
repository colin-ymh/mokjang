'use client';

import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';

const SideBarContainer = styled.div<{ width: number }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: ${({ width }) => width}px;
  position: relative;
  flex-shrink: 0; /* 추가: 축소 방지 */

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    display: none;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.TABLET}) {
    display: none;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    background-color: ${WHITE};
    border-right: 0.7px solid ${GRAY.LIGHT};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow: hidden;
`;

const ResizeHandle = styled.div<{ $isResizing?: boolean }>`
  position: absolute;
  right: -2px; /* 수정: 위치 조정 */
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  background-color: ${({ $isResizing }) =>
    $isResizing ? MAIN.LIGHT : 'transparent'};

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const OpenButton = styled.div<{ $isShown: boolean }>`
  display: flex;
  cursor: pointer;
  width: ${({ $isShown }) => ($isShown ? 30 : 0)}px;
  height: 100px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: ${GRAY.LIGHT};
  position: absolute;
  right: -30px;
  top: 5px;
`;

interface SideBarViewProps {
  sideBarWidth: number;
  sideButtonList: ReactNode;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  isResizing: boolean;
  onClickOpen: () => void;
}

const SideView = ({
  sideBarWidth,
  sideButtonList,
  onMouseDown,
  isResizing,
  onClickOpen,
}: SideBarViewProps) => {
  return (
    <SideBarContainer width={sideBarWidth}>
      <ButtonContainer>{sideButtonList}</ButtonContainer>
      <ResizeHandle onMouseDown={onMouseDown} $isResizing={isResizing} />
      <OpenButton $isShown={sideBarWidth === 0} onClick={onClickOpen} />
    </SideBarContainer>
  );
};

export default SideView;
