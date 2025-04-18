import styled from 'styled-components';
import { ReactNode, useEffect } from 'react';
import { DIRECTION } from '@/constants/styles/style';
import { GRAY, WHITE } from '@/constants/styles/color';
import { MEDIA_MAX_WIDTH } from '@/constants/constant';
import PopupLayout from '@/components/organisms/layout/popup-layout';

const SlidePanel = styled.div<{
  isShow: boolean;
  direction: DIRECTION;
  size: number;
}>`
  position: fixed;
  background-color: ${WHITE};
  z-index: 50;
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;

  ${({ direction, isShow, size }) => {
    switch (direction) {
      case DIRECTION.LEFT:
        return `
          top: 0;
          bottom: 0;
          left: 0;
          width: ${size}px;
          transform: translateX(${isShow ? 0 : '-100%'});
        `;
      case DIRECTION.RIGHT:
        return `
          top: 0;
          bottom: 0;
          right: 0;
          width: ${size}px;
          transform: translateX(${isShow ? 0 : '100%'});
        `;
      case DIRECTION.TOP:
        return `
          left: 0;
          right: 0;
          top: 0;
          height: ${size}px;
          transform: translateY(${isShow ? 0 : '-100%'});
        `;
      case DIRECTION.BOTTOM:
        return `
          left: 0;
          right: 0;
          bottom: 0;
          height: ${size}px;
          transform: translateY(${isShow ? 0 : '100%'});
        `;
      default:
        return '';
    }
  }};

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    ${({ direction }) =>
      direction === DIRECTION.LEFT || direction === DIRECTION.RIGHT
        ? 'width: 100%;'
        : 'height: 100%;'}
  }

  @media (max-width: ${MEDIA_MAX_WIDTH.DESKTOP}) {
    ${({ direction, isShow, size }) => {
      switch (direction) {
        case DIRECTION.LEFT:
          return `
           border-right: 1px solid ${GRAY.LIGHT};
        `;
        case DIRECTION.RIGHT:
          return `
           border-left: 1px solid ${GRAY.LIGHT};
        `;
        case DIRECTION.TOP:
          return `
          border-bottom: 1px solid ${GRAY.LIGHT};
        `;
        case DIRECTION.BOTTOM:
          return `
           border-top: 1px solid ${GRAY.LIGHT};
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
  onClickClose: () => void;
  headerRight?: ReactNode;
  size?: number; // 수평 슬라이드면 width, 수직 슬라이드면 height
  children: ReactNode;
};

const SlidePopup = ({
  isShow,
  direction = DIRECTION.RIGHT,
  onClickClose,
  headerRight,
  size = 670,
  children,
}: SlidePopupProps) => {
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

  return (
    <SlidePanel
      isShow={isShow}
      direction={direction}
      size={size}
      onClick={(e) => e.stopPropagation()}
    >
      <PopupLayout onClickClose={onClickClose} headerRight={headerRight}>
        {children}
      </PopupLayout>
    </SlidePanel>
  );
};

export default SlidePopup;
