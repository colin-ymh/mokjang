'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

export type TransparentBackgroundProps = {
  isOpened: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  blur?: boolean;
  zIndex?: number; // 필요 시 커스터마이즈
};

/* 오버레이 스타일 */
const Overlay = styled.div<{ $blur: boolean; $zIndex: number }>`
  position: fixed;
  inset: 0;
  background: ${({ $blur }) => ($blur ? 'rgba(0, 0, 0, 0.1)' : 'transparent')};
  z-index: ${({ $zIndex }) => $zIndex};
  pointer-events: auto; /* 뒷면 터치 차단 */
  touch-action: none;
`;

const TransparentBackground = ({
  isOpened,
  onClick,
  blur = false,
  zIndex = 50,
}: TransparentBackgroundProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!isOpened || !mounted) return null;

  return <Overlay $blur={blur} $zIndex={zIndex} onClick={onClick} />;
  // return createPortal(
  //   <Overlay $blur={blur} $zIndex={zIndex} onClick={onClick} />,
  //   document.body
  // );
};

export default TransparentBackground;
