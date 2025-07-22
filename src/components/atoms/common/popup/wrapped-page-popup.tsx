import { ReactNode } from 'react';
import styled from 'styled-components';

import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import Hide from '@/components/atoms/common/etc/hide';
import PopupLayout from '@/components/organisms/layout/popup-layout';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useI18n } from '../../../../../locales/client';

import ArrowUp from '../../../../../public/svg/arror-up.svg';

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
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const HeaderContainer = styled.div`
  display: flex;
  width: 600px;
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
  width: 600px;
  height: 90%;
  background-color: ${WHITE};
  border-radius: 10px;
  border: 1px solid ${GRAY.EXTRA_LIGHT};
  overflow: hidden;
  box-shadow: 0px 1px 2px 0px #0000000d;
`;

interface WrappedPagePopupProps {
  isShow: boolean;
  isFooterShown?: boolean;
  onClickClose: () => void;
  onClickDone?: () => void;
  headerTitle?: string;
  headerDescription?: string;
  headerRight?: ReactNode;
  cancelText?: string;
  doneText?: string;
  cancelBackgroundColor?: string;
  doneBackgroundColor?: string;
  doneDisabled?: boolean;
  children: ReactNode;
}

// 특정 컴포넌트를 전체화면 페이지인 것처럼 보아게 해주는 모달
const WrappedPagePopup = ({
  isShow,
  isFooterShown,
  onClickClose,
  onClickDone,
  headerTitle,
  headerDescription,
  headerRight,
  cancelText,
  doneText,
  cancelBackgroundColor,
  doneBackgroundColor,
  doneDisabled,
  children,
}: WrappedPagePopupProps) => {
  if (!isShow) {
    return <Hide />;
  }

  const t = useI18n();

  return (
    <WrappedPagePopupContainer>
      <HeaderContainer>
        <GoBackContainer onClick={onClickClose}>
          <ArrowLeft />
          <MainText color={MAIN.DEFAULT}>{t('button.backToList')}</MainText>
        </GoBackContainer>
      </HeaderContainer>
      <ContentWrapper>
        <PopupLayout
          onClickCancel={onClickClose}
          onClickDone={onClickDone}
          headerTitle={headerTitle}
          headerDescription={headerDescription}
          headerRight={headerRight}
          doneText={doneText}
          cancelText={cancelText}
          doneBackgroundColor={doneBackgroundColor}
          cancelBackgroundColor={cancelBackgroundColor}
          doneDisabled={doneDisabled}
          isFooterShown={isFooterShown}
        >
          {children}
        </PopupLayout>
      </ContentWrapper>
    </WrappedPagePopupContainer>
  );
};

export default WrappedPagePopup;
