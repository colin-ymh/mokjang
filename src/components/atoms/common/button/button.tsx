import React, { ReactNode } from 'react';
import styled from 'styled-components';

import {
  MainText,
  MainTextProps,
} from '@/components/atoms/common/text/main-text';
import { MAIN, WHITE } from '@/constants/styles/color';

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
};

const ButtonContainer = styled.button<{
  disabled?: boolean;
  width?: number | 'auto';
  height?: number;
  $backgroundColor?: string;
  $isShadow?: boolean;
  $borderRadius?: number;
  $borderColor?: string;
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

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px;
`;

const Button = ({
  text,
  disabled = false,
  onClick,
  width,
  height,
  backgroundColor = MAIN.DEFAULT,
  isShadow = false,
  borderRadius = 10,
  color = WHITE,
  fontWeight,
  fontSize,
  children,
  icon,
  borderColor,
  onMouseDown,
  onMouseUp,
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
    >
      {children ? (
        children
      ) : (
        <ContentWrapper>
          {icon}
          <MainText color={color} fontWeight={fontWeight} fontSize={fontSize}>
            {text}
          </MainText>
        </ContentWrapper>
      )}
    </ButtonContainer>
  );
};

export default Button;
