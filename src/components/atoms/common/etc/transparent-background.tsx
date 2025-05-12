'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  zIndex = 50, // 드롭다운보다 확실히 높게
}: TransparentBackgroundProps) => {
  /* Next.js SSR 호환: 브라우저에서만 Portal 렌더 */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!isOpened || !mounted) return null;

  /* body 바로 아래로 Portal */
  return createPortal(
    <Overlay $blur={blur} $zIndex={zIndex} onClick={onClick} />,
    document.body
  );
};

export default TransparentBackground;
