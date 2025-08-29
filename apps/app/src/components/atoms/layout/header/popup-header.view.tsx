import React from 'react';
import styled from 'styled-components';

import { GRAY, MAIN, WHITE } from '../../../../constants/styles/color';
import { MainText } from '../../common/text/main-text';
import { SIZE } from '../../../../constants/styles/style';
import Button from '../../common/button/button';
import {
  MEDIA_MAX_WIDTH,
  MEDIA_MIN_WIDTH,
} from '../../../../constants/constant';

/* ───────── 스타일 ───────── */
const HeaderContainer = styled.header<{
  $isHeaderBorderShown: boolean;
  height: number;
}>`
  position: relative;
  z-index: 10;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ height }) => `${height}px`};
  flex-shrink: 0;
  background-color: ${WHITE};
  border-bottom: ${({ $isHeaderBorderShown }) =>
    `1px solid ${$isHeaderBorderShown ? GRAY.EXTRA_LIGHT : 'transparent'}`};
`;

const HeaderLeft = styled.div`
  display: flex;
  flex: 1;
  padding-left: 10px;
  justify-content: flex-start;
  align-items: center;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
`;

const HeaderTitle = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    padding-left: 20px;
    justify-content: flex-start;
  }
`;

// 오른쪽 영역: 항상 flex container
const HeaderRight = styled.div`
  display: flex;
  flex: 1;
  padding-right: 10px;
  justify-content: flex-end;
  align-items: center;
`;

const ButtonContainer = styled.div`
  @media (max-width: ${MEDIA_MAX_WIDTH.DESKTOP}) {
    display: none;
  }
`;

/* ───────── 컴포넌트 ───────── */
type PopupHeaderViewProps = {
  headerTitle?: string;
  headerDescription?: string;
  headerRight?: React.ReactNode;
  onClickCancel: () => void;
  onClickDone?: () => void;
  cancelText: string;
  doneText: string;
  isHeaderBorderShown?: boolean;
  height?: number;
};

const PopupHeaderView = ({
  headerTitle,
  headerDescription,
  headerRight,
  onClickCancel,
  onClickDone,
  cancelText,
  doneText,
  isHeaderBorderShown = true,
  height = 80,
}: PopupHeaderViewProps) => {
  return (
    <HeaderContainer $isHeaderBorderShown={isHeaderBorderShown} height={height}>
      <HeaderLeft>
        {/*<Button*/}
        {/*  text={cancelText}*/}
        {/*  onClick={onClickCancel}*/}
        {/*  backgroundColor={WHITE}*/}
        {/*  color={GRAY.DEFAULT}*/}
        {/*/>*/}
      </HeaderLeft>

      <HeaderTitle>
        <MainText size={SIZE.EXTRA_LARGE} fontSize={22}>
          {headerTitle}
        </MainText>
        {headerDescription && (
          <MainText color={GRAY.SEMI_DARK}>{headerDescription}</MainText>
        )}
      </HeaderTitle>

      <HeaderRight>
        {/*
          1) headerRight prop이 있으면 무조건 렌더링
          2) 없고 onClickDone이 있으면 모바일 전용 버튼
          3) 데스크탑(onClickDone 있어도)에서는 숨김
        */}
        {headerRight
          ? headerRight
          : onClickDone && (
              <ButtonContainer>
                <Button
                  text={doneText}
                  onClick={onClickDone}
                  backgroundColor={WHITE}
                  color={MAIN.DEFAULT}
                  width={40}
                />
              </ButtonContainer>
            )}
      </HeaderRight>
    </HeaderContainer>
  );
};

export default PopupHeaderView;
