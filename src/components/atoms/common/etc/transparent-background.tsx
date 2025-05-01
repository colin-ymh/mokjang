'use client';

import styled from 'styled-components';

export type TransparentBackgroundProps = {
  isOpened: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  blur?: boolean;
  zIndex?: number;
};

type BackgroundProps = {
  $isOpened: boolean;
  $blur: boolean;
  $zIndex?: number;
};

const Background = styled.div<BackgroundProps>`
  position: fixed;
  inset: 0;
  background-color: ${({ $blur }) =>
    $blur ? 'rgba(0, 0, 0, 0.1)' : 'transparent'};
  z-index: ${({ $zIndex }) => $zIndex}
  display: ${({ $isOpened }) => ($isOpened ? 'block' : 'none')};

  pointer-events: all;  /* 여기서 반드시 이벤트를 다 받아야 함 */
  touch-action: none;   /* 모바일 터치 방지 */
`;

// 특정 페이지 내에서 활성화 된 구역 외 다른 곳을 터치 했을 때 특정 기능을 수행 하도록 하는 투명 background 버튼
const TransparentBackground = ({
  isOpened,
  onClick,
  zIndex = 40,
  blur = false,
}: TransparentBackgroundProps) => {
  if (!isOpened) return null;

  return (
    <Background
      $isOpened={isOpened}
      onClick={(event) => {
        event.stopPropagation();

        onClick(event);
      }}
      $blur={blur}
      $zIndex={zIndex}
    />
  );
};

export default TransparentBackground;
