import styled from 'styled-components';
import { ReactNode, useEffect } from 'react';
import { DIRECTION, GRAY, MEDIA_MAX_WIDTH, WHITE } from '@mokjang/constants';
import { PopupLayout } from '@mokjang/components';

const SlidePanel = styled.div<{
  $isShow: boolean;
  direction: DIRECTION;
  size: number;
  $isPercentage: boolean;
}>`
  position: fixed;
  background-color: ${WHITE};
  z-index: 50;
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ $isShow }) => $isShow && `0 2px 10px rgba(0, 0, 0, 0.3)`};

  ${({ direction, $isShow, size, $isPercentage }) => {
    const sizeValue = $isPercentage
      ? direction === DIRECTION.LEFT || direction === DIRECTION.RIGHT
        ? `${size}vw` // 👈 가로 슬라이드는 viewport width 기준
        : `${size}vh` // 👈 세로 슬라이드는 viewport height 기준
      : `${size}px`;
    switch (direction) {
      case DIRECTION.LEFT:
        return `
        top: 0;
        bottom: 0;
        left: 0;
        width: ${sizeValue};
        transform: translateX(${$isShow ? 0 : '-100%'});
      `;
      case DIRECTION.RIGHT:
        return `
        top: 0;
        bottom: 0;
        right: 0;
        width: ${sizeValue};
        transform: translateX(${$isShow ? 0 : '100%'});
      `;
      case DIRECTION.TOP:
        return `
        left: 0;
        right: 0;
        top: 0;
        height: ${sizeValue};
        transform: translateY(${$isShow ? 0 : '-100%'});
      `;
      case DIRECTION.BOTTOM:
        return `
        left: 0;
        right: 0;
        bottom: 0;
        height: ${sizeValue};
        transform: translateY(${$isShow ? 0 : '100%'});
      `;
      default:
        return '';
    }
  }};

  @media (max-width: ${MEDIA_MAX_WIDTH.TABLET}) {
    ${({ direction }) =>
      direction === DIRECTION.LEFT || direction === DIRECTION.RIGHT
        ? 'width: 100%;'
        : 'height: 100%;'}
  }

  @media (max-width: ${MEDIA_MAX_WIDTH.DESKTOP}) {
    ${({ direction }) => {
      switch (direction) {
        case DIRECTION.LEFT:
          return `
           border-right: 1px solid ${GRAY.SEMI_LIGHT};
        `;
        case DIRECTION.RIGHT:
          return `
           border-left: 1px solid ${GRAY.SEMI_LIGHT};
        `;
        case DIRECTION.TOP:
          return `
          border-bottom: 1px solid ${GRAY.SEMI_LIGHT};
        `;
        case DIRECTION.BOTTOM:
          return `
           border-top: 1px solid ${GRAY.SEMI_LIGHT};
        `;
        default:
          return '';
      }
    }};
  }
`;

type SlidePopupProps = {
  isShow: boolean;
  direction?: DIRECTION;
  size?: number; // 수평 슬라이드면 width, 수직 슬라이드면 height
  isPercentage?: boolean;

  isFooterShown?: boolean;
  onClickClose: () => void;
  onClickDone?: () => void;
  headerTitle?: string;
  headerLeft?: ReactNode;
  headerHeight?: number;
  headerRight?: ReactNode;
  cancelText?: string;
  doneText?: string;
  cancelBackgroundColor?: string;
  doneBackgroundColor?: string;
  doneDisabled?: boolean;
  doneIcon?: ReactNode;
  cancelIcon?: ReactNode;
  disabledKeyboard?: boolean;
  children: ReactNode;
};

const SlidePopup = ({
  isShow,
  direction = DIRECTION.RIGHT,
  size = 650,
  isPercentage = false,

  isFooterShown,
  onClickClose,
  onClickDone,
  headerTitle,
  headerLeft,
  headerHeight,
  headerRight,
  cancelText,
  doneText,
  cancelBackgroundColor,
  doneBackgroundColor,
  doneDisabled,
  disabledKeyboard = false,
  children,
}: SlidePopupProps) => {
  useEffect(() => {
    if (disabledKeyboard) return;

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
    <SlidePanel
      $isShow={isShow}
      direction={direction}
      size={size}
      onClick={(e) => e.stopPropagation()}
      $isPercentage={isPercentage}
    >
      <PopupLayout
        onClickCancel={onClickClose}
        onClickDone={onClickDone}
        headerTitle={headerTitle}
        headerRight={headerRight}
        headerLeft={headerLeft}
        headerHeight={headerHeight}
        doneText={doneText}
        cancelText={cancelText}
        doneBackgroundColor={doneBackgroundColor}
        cancelBackgroundColor={cancelBackgroundColor}
        doneDisabled={doneDisabled}
        isFooterShown={isFooterShown}
      >
        {children}
      </PopupLayout>
    </SlidePanel>
  );
};

export default SlidePopup;
