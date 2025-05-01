import React from 'react';
import styled from 'styled-components';

import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import Button from '@/components/atoms/common/button/button';
import { MEDIA_MAX_WIDTH, MEDIA_MIN_WIDTH } from '@/constants/constant';

/* ───────── 스타일 ───────── */
const HeaderContainer = styled.header`
  position: relative;
  z-index: 10;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  flex-shrink: 0;
  background-color: ${WHITE};
  border-bottom: 1px solid ${GRAY.LIGHT};
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
  justify-content: center;
  align-items: center;

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
  headerRight?: React.ReactNode;
  onClickCancel: () => void;
  onClickDone?: () => void;
  cancelText: string;
  doneText: string;
};

const PopupHeaderView = ({
  headerTitle,
  headerRight,
  onClickCancel,
  onClickDone,
  cancelText,
  doneText,
}: PopupHeaderViewProps) => {
  return (
    <HeaderContainer>
      <HeaderLeft>
        <Button
          text={cancelText}
          onClick={onClickCancel}
          backgroundColor={WHITE}
          color={GRAY.DEFAULT}
        />
      </HeaderLeft>

      <HeaderTitle>
        <MainText size={SIZE.EXTRA_LARGE} fontWeight={600}>
          {headerTitle}
        </MainText>
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
