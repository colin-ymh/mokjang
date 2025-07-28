'use client';

import { ReactNode, useEffect } from 'react';
import styled from 'styled-components';

import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import Hide from '@/components/atoms/common/etc/hide';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useScopedI18n } from '../../../../../locales/client';

import ArrowUp from '../../../../../public/svg/arror-up.svg';
import Button from '@/components/atoms/common/button/button';

const WrappedPagePopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${GRAY.SUPER_LIGHT};
  z-index: 1000;
  align-items: center;
  justify-content: center;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 800px;
  padding: 20px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const GoBackContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  height: 30px;
  cursor: pointer;
`;

const ArrowLeft = styled(ArrowUp)`
  width: 14px;
  height: 14px;
  stroke-width: 2px;
  stroke: ${MAIN.DEFAULT};
  transform: rotate(270deg);
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 800px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

interface WrappedPagePopupProps {
  isShow: boolean;
  onClickClose: () => void;
  children: ReactNode;
  headerTitle?: string;
  headerDescription?: string;
  onClickDone?: () => void;
  onClickCancel?: () => void;
  doneText?: string;
  cancelText?: string;
  doneBackgroundColor?: string;
  doneDisabled?: boolean;
}

// 특정 컴포넌트를 전체화면 페이지인 것처럼 보아게 해주는 모달
const WrappedPagePopup = ({
  isShow,
  onClickClose,
  children,
  headerTitle,
  headerDescription,
  onClickDone,
  onClickCancel,
  doneBackgroundColor = MAIN.DEFAULT,
  doneDisabled = false,
  doneText,
  cancelText,
}: WrappedPagePopupProps) => {
  useEffect(() => {
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

  const t_button = useScopedI18n('button');

  if (!isShow) {
    return <Hide />;
  }

  return (
    <WrappedPagePopupContainer>
      <HeaderContainer>
        {/* 돌아가기 */}
        <GoBackContainer onClick={onClickClose}>
          <ArrowLeft />
          <MainText color={MAIN.DEFAULT}>{t_button('backToList')}</MainText>
        </GoBackContainer>
        {/* 제목 + 버튼 */}
        <TitleContainer>
          {/* 제목 */}
          <TextContainer>
            <MainText fontSize={30} fontWeight={700}>
              {headerTitle}
            </MainText>
            {headerDescription && (
              <MainText fontSize={16} fontWeight={400} color={GRAY.DEFAULT}>
                {headerDescription}
              </MainText>
            )}
          </TextContainer>
          {/* 버튼 */}
          <ButtonContainer>
            <Button
              width={80}
              height={30}
              color={WHITE}
              backgroundColor={doneBackgroundColor}
              onClick={onClickDone}
              text={doneText || t_button('save')}
              disabled={doneDisabled}
            />
            <Button
              width={80}
              height={30}
              color={GRAY.DEFAULT}
              backgroundColor={WHITE}
              onClick={onClickCancel}
              borderColor={GRAY.SEMI_LIGHT}
              text={cancelText || t_button('cancel')}
            />
          </ButtonContainer>
        </TitleContainer>
      </HeaderContainer>
      <ContentWrapper>{children}</ContentWrapper>
    </WrappedPagePopupContainer>
  );
};

export default WrappedPagePopup;
