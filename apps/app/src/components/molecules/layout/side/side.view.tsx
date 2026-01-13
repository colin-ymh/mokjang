'use client';

import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { GRAY, MAIN, WHITE } from '@mokjang/constants';
import { MEDIA_MIN_WIDTH } from '@mokjang/constants';

const SideBarContainer = styled.div<{ width: number; $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  flex-direction: column;
  height: 100%;
  position: relative;
  flex-shrink: 0; /* 추가: 축소 방지 */
  background-color: ${WHITE};
  border-right: 0.7px solid ${GRAY.LIGHT};

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    width: 100%;
  }

  // @media (min-width: ${MEDIA_MIN_WIDTH.TABLET}) {
  //   display: none;
  // }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    width: ${({ width }) => width}px;
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
  isSideShown: boolean;
}

const SideView = ({
  sideBarWidth,
  sideButtonList,
  onMouseDown,
  isResizing,
  onClickOpen,
  isSideShown,
}: SideBarViewProps) => {
  return (
    <SideBarContainer $isShown={isSideShown} width={sideBarWidth}>
      <ButtonContainer>{sideButtonList}</ButtonContainer>
      {/*<ResizeHandle onMouseDown={onMouseDown} $isResizing={isResizing} />*/}
      {/*<OpenButton $isShown={sideBarWidth === 0} onClick={onClickOpen} />*/}
    </SideBarContainer>
  );
};

export default SideView;
