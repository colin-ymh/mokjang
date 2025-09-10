import { ReactNode, useEffect } from 'react';
import styled from 'styled-components';

import { createPortal } from 'react-dom';
import { PopupLayout } from '../layout';
import { MEDIA_MIN_WIDTH, WHITE } from '@mokjang/constants';
import { TransparentBackground } from '../etc';

const ModalContainer = styled.div<{
  width?: number;
  height?: number;
  $isPercentage?: boolean;
  $zIndex?: number;
}>`
  position: fixed; /* 화면에 고정 */
  top: 50%; /* 세로 중앙 */
  left: 50%; /* 가로 중앙 */
  transform: translate(-50%, -50%); /* 정확히 중앙으로 이동 */
  z-index: ${({ $zIndex }) => $zIndex};

  display: flex;
  flex-direction: column;
  background-color: ${WHITE};
  border-radius: 10px;
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
  zIndex?: number;
  onClickClose: () => void;
  onClickCancel?: () => void;
  onClickDone?: () => void;
  headerTitle?: string;
  headerDescription?: string;
  headerRight?: ReactNode;
  cancelText?: string;
  doneText?: string;
  cancelBackgroundColor?: string;
  doneBackgroundColor?: string;
  doneDisabled?: boolean;
  isFooterShown?: boolean;
  isHeaderShown?: boolean;
  isHeaderBorderShown?: boolean;
  headerHeight?: number;
  keyboardDisabled?: boolean;
  children: ReactNode;
};

export const CustomPopup = ({
  isShow,
  width,
  height,
  isPercentage = false,
  isPortal = true,
  zIndex = 1000,
  onClickClose,
  onClickCancel,
  onClickDone,
  headerTitle,
  headerDescription,
  headerRight,
  cancelText,
  doneText,
  cancelBackgroundColor,
  doneBackgroundColor,
  doneDisabled,
  isFooterShown,
  isHeaderShown,
  isHeaderBorderShown,
  headerHeight,
  keyboardDisabled,
  children,
}: CustomPopupProps) => {
  useEffect(() => {
    if (keyboardDisabled) return;
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

  const modalContent = (
    <>
      <TransparentBackground
        isOpened={isShow}
        onClick={onClickClose}
        zIndex={zIndex - 100}
      />
      <ModalContainer
        width={width}
        height={height}
        $isPercentage={isPercentage}
        $zIndex={zIndex}
      >
        <PopupLayout
          onClickClose={onClickClose}
          onClickCancel={onClickCancel}
          onClickDone={onClickDone}
          headerTitle={headerTitle}
          headerDescription={headerDescription}
          headerRight={headerRight}
          cancelText={cancelText}
          doneText={doneText}
          doneBackgroundColor={doneBackgroundColor}
          cancelBackgroundColor={cancelBackgroundColor}
          doneDisabled={doneDisabled}
          isFooterShown={isFooterShown}
          isHeaderShown={isHeaderShown}
          isHeaderBorderShown={isHeaderBorderShown}
          headerHeight={headerHeight}
        >
          {children}
        </PopupLayout>
      </ModalContainer>
    </>
  );

  return isPortal ? createPortal(modalContent, document.body) : modalContent;
};
