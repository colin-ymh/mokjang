import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { MainText, MainTextProps } from '../text';
import { CURSOR, MAIN, WHITE } from '@mokjang/constants';

export type ButtonProps = MainTextProps & {
  text?: string;
  disabled?: boolean;
  onClick?: (event: any) => void;
  width?: number | 'auto';
  height?: number;
  backgroundColor?: string;
  color?: string;
  isShadow?: boolean;
  borderRadius?: number;
  children?: ReactNode;
  icon?: ReactNode;
  borderColor?: string;
  onMouseUp?: (event: any) => void;
  onMouseDown?: (event: any) => void;
  columnPadding?: number;
  rowPadding?: number;
  baselineOffsetPx?: number;
  gap?: number;
};

const ButtonContainer = styled.button<{
  disabled?: boolean;
  width?: number | 'auto';
  height?: number;
  $backgroundColor?: string;
  $isShadow?: boolean;
  $borderRadius?: number;
  $borderColor?: string;
  $columnPadding: number;
  $rowPadding: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  width: ${({ width }) =>
    width ? (width === 'auto' ? width : `${width}px`) : '100%'};
  height: ${({ height }) => (height ? `${height}px` : '100%')};
  border-radius: ${({ $borderRadius }) =>
    $borderRadius !== null && $borderRadius !== undefined
      ? `${$borderRadius}px`
      : '5px'};
  border: ${({ $borderColor }) =>
    $borderColor ? `1px solid ${$borderColor}` : 'none'};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.1s ease;
  box-shadow: ${({ $isShadow, disabled }) =>
    $isShadow && !disabled ? '2px 2px 5px rgba(0, 0, 0, 0.2)' : 'none'};
  overflow: hidden;
  flex-shrink: 0;

  &:active {
    transform: scale(0.98);
    box-shadow: none;
  }
`;

const ContentWrapper = styled.div<{ gap: number }>`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: ${({ gap }) => gap}px;
  padding: 2px;
`;

export const Button = ({
  text,
  disabled = false,
  onClick,
  width,
  height,
  backgroundColor = MAIN.DEFAULT,
  isShadow = false,
  borderRadius = 5,
  color = WHITE,
  fontWeight,
  fontSize,
  children,
  icon,
  borderColor,
  onMouseDown,
  onMouseUp,
  columnPadding = 5,
  rowPadding = 5,
  baselineOffsetPx = 0.5,
  gap = 5,
}: ButtonProps) => {
  return (
    <ButtonContainer
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      width={width}
      height={height}
      $borderRadius={borderRadius}
      $backgroundColor={backgroundColor}
      $isShadow={isShadow}
      $borderColor={borderColor}
      $columnPadding={columnPadding}
      $rowPadding={rowPadding}
    >
      {children ? (
        children
      ) : (
        <ContentWrapper gap={gap}>
          {icon}
          {text && (
            <MainText
              color={color}
              fontWeight={fontWeight}
              fontSize={fontSize}
              cursor={CURSOR.POINTER}
              baselineOffsetPx={baselineOffsetPx}
            >
              {text}
            </MainText>
          )}
        </ContentWrapper>
      )}
    </ButtonContainer>
  );
};
