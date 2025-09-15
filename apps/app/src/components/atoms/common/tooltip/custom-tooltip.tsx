import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
import { GRAY, SIZE, WHITE } from '@mokjang/constants';
import { MainText } from '@mokjang/components';

const TooltipBox = styled.div.attrs<{ $style: React.CSSProperties }>(
  (props) => ({
    style: props.$style,
  })
)`
  position: fixed;
  padding: 4px 8px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 2147483647;
  pointer-events: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
`;

type CommonProps = {
  text?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  width?: number | string;
  height?: number | string;
  offsetX?: number;
  offsetY?: number;
};

// Controlled 모드: children 없이 외부에서 visible/x/y를 제어
type ControlledProps = CommonProps & {
  visible: boolean;
  x: number;
  y: number;
  disabled?: never;
  children?: never;
  followCursor?: never;
};

// Wrapper 모드: children을 감싸 hover/focus 시 자동으로 표시
type WrapperProps = CommonProps & {
  disabled?: boolean;
  followCursor?: boolean; // 기본 true: 커서를 따라다님
  visible?: never;
  x?: never;
  y?: never;
  children: React.ReactNode;
};

type TooltipProps = ControlledProps | WrapperProps;

/**
 * Tooltip (Unified)
 * - Wrapper 모드: children을 감싸서 hover/focus 시 커서를 따라다니는 툴팁 표시
 * - Controlled 모드: visible/x/y를 직접 제어하여 원하는 위치에 표시
 */
const Tooltip = (props: TooltipProps) => {
  const {
    text,
    backgroundColor = WHITE,
    borderColor = GRAY.DEFAULT,
    textColor = GRAY.DARK,
    width,
    height,
    offsetX = 10,
    offsetY = 10,
  } = props as CommonProps;

  const isWrapperMode = 'children' in props;

  // ---- Wrapper 모드 상태/로직 ----
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const followCursor = isWrapperMode ? (props.followCursor ?? true) : false;
  const disabled = isWrapperMode ? !!props.disabled : false;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !followCursor) return;
    const { clientX, clientY } = e;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      setPos({ x: clientX, y: clientY });
    });
  };

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // 표시 여부와 좌표 계산
  const visible = isWrapperMode
    ? hover && !disabled
    : (props as ControlledProps).visible;
  const x = isWrapperMode ? pos.x : (props as ControlledProps).x;
  const y = isWrapperMode ? pos.y : (props as ControlledProps).y;

  const box = visible
    ? createPortal(
        <TooltipBox
          $style={{
            top: y,
            left: x,
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            background: backgroundColor,
            borderColor: borderColor,
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
            display: text?.length === 0 ? 'none' : 'auto',
          }}
        >
          <MainText size={SIZE.SMALL} color={textColor}>
            {text}
          </MainText>
        </TooltipBox>,
        document.body
      )
    : null;

  if (!isWrapperMode) {
    // Controlled 모드: 표시만
    return box;
  }

  // Wrapper 모드: children을 감싸 이벤트 부여
  return (
    <span
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={handleMouseMove}
      // 키보드 접근성(포커스 시 표시)
      onFocus={() => !disabled && setHover(true)}
      onBlur={() => setHover(false)}
      style={{ display: 'contents' }}
    >
      {props.children}
      {box}
    </span>
  );
};

export default Tooltip;
