import React, { ReactNode, useEffect } from 'react';
import styled from 'styled-components';

import { WHITE } from '@/constants/styles/color';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import TransparentBackground from '@/components/atoms/common/etc/transparent-background';
import PopupLayout from '@/components/organisms/layout/popup-layout';
import { createPortal } from 'react-dom';

const ModalContainer = styled.div<{
  width?: number;
  height?: number;
  $isPercentage?: boolean;
}>`
  position: fixed; /* 화면에 고정 */
  top: 50%; /* 세로 중앙 */
  left: 50%; /* 가로 중앙 */
  transform: translate(-50%, -50%); /* 정확히 중앙으로 이동 */
  z-index: 1000;

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

type CustomPopupProps = {
  isShow: boolean;
  width?: number;
  height?: number;
  isPercentage?: boolean;
  isPortal?: boolean;

  onClickCancel: () => void;
  onClickDone?: () => void;
  headerTitle?: string;
  headerRight?: ReactNode;
  cancelText?: string;
  doneText?: string;
  cancelBackgroundColor?: string;
  doneBackgroundColor?: string;
  doneDisabled?: boolean;
  isFooterShown?: boolean;
  isHeaderShown?: boolean;
  isHeaderBorderShown?: boolean;
  children: ReactNode;
};

const CustomPopup = ({
  isShow,
  width,
  height,
  isPercentage = false,
  isPortal,

  onClickCancel,
  onClickDone,
  headerTitle,
  headerRight,
  cancelText,
  doneText,
  cancelBackgroundColor,
  doneBackgroundColor,
  doneDisabled,
  isFooterShown,
  isHeaderShown,
  isHeaderBorderShown,
  children,
}: CustomPopupProps) => {
  useEffect(() => {
    // ESC 누르면 닫기
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClickCancel();
      }
    };

    if (isShow) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isShow, onClickCancel]);

  if (!isShow) return null;

  const modalContent = (
    <>
      <TransparentBackground isOpened={isShow} onClick={onClickCancel} />
      <ModalContainer
        width={width}
        height={height}
        $isPercentage={isPercentage}
      >
        <PopupLayout
          onClickCancel={onClickCancel}
          onClickDone={onClickDone}
          headerTitle={headerTitle}
          headerRight={headerRight}
          cancelText={cancelText}
          doneText={doneText}
          doneBackgroundColor={doneBackgroundColor}
          cancelBackgroundColor={cancelBackgroundColor}
          doneDisabled={doneDisabled}
          isFooterShown={isFooterShown}
          isHeaderShown={isHeaderShown}
          isHeaderBorderShown={isHeaderBorderShown}
        >
          {children}
        </PopupLayout>
      </ModalContainer>
    </>
  );

  return isPortal ? createPortal(modalContent, document.body) : modalContent;
};

export default CustomPopup;
