"use client";

import styled from "styled-components";

export type TransparentBackgroundProps = {
  isOpened: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  blur?: boolean;
};

type BackgroundProps = {
  $isOpened: boolean;
  $blur: boolean;
};

const Background = styled.div<BackgroundProps>`
  position: fixed;
  inset: 0;
  background-color: ${({ $blur }) =>
    $blur ? "rgba(0, 0, 0, 0.3)" : "transparent"};
  z-index: 40;
  display: ${({ $isOpened }) => ($isOpened ? "block" : "none")};
`;

// 특정 페이지 내에서 활성화 된 구역 외 다른 곳을 터치 했을 때 특정 기능을 수행 하도록 하는 투명 background 버튼
const TransparentBackground = ({
  isOpened,
  onClick,
  blur = true,
}: TransparentBackgroundProps) => {
  if (!isOpened) return null;

  return <Background $isOpened={isOpened} onClick={onClick} $blur={blur} />;
};

export default TransparentBackground;
