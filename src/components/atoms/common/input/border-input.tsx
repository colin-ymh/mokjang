'use client';

import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { BLACK, GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { InputProps } from '@/components/atoms/common/input/main-input';
import { BLANK } from '@/constants/constant';

const BorderInputContainer = styled.input<{
  $isEditable: boolean;
  $borderColor: string;
  height?: number;
  width?: number;
  $disabled?: boolean;
  $backgroundColor?: string;
  $paddingLeft?: number;
  $borderTopLeftRadius?: number;
  $borderTopRightRadius?: number;
  $borderBottomLeftRadius?: number;
  $borderBottomRightRadius?: number;
}>`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  box-sizing: border-box;
  font-size: 14px;
  padding: 10px;
  padding-left: ${({ $paddingLeft }) => `${$paddingLeft}px` || '30'};
  border: 1px solid ${({ $borderColor }) => $borderColor};
  color: ${BLACK};
  transition: border 0.3s ease;
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
  pointer-events: ${({ $isEditable }) => ($isEditable ? 'auto' : 'none')};
  background-color: ${({ $disabled, $backgroundColor }) =>
    $disabled ? GRAY.SEMI_LIGHT : $backgroundColor || WHITE};

  border-top-left-radius: ${({ $borderTopLeftRadius }) =>
    $borderTopLeftRadius ?? 5}px;
  border-top-right-radius: ${({ $borderTopRightRadius }) =>
    $borderTopRightRadius ?? 5}px;
  border-bottom-left-radius: ${({ $borderBottomLeftRadius }) =>
    $borderBottomLeftRadius ?? 5}px;
  border-bottom-right-radius: ${({ $borderBottomRightRadius }) =>
    $borderBottomRightRadius ?? 5}px;

  &:focus {
    outline: none;
    border: 1px solid ${MAIN.DEFAULT};
  }
`;

export type BorderInputProps = InputProps & {
  borderColor?: string;
  height?: number;
  width?: number;
  backgroundColor?: string;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  readOnly?: boolean;
};

const BorderInput = forwardRef<HTMLInputElement, BorderInputProps>(
  (
    {
      onKeyDown,
      readOnly = false,
      borderColor = GRAY.DEFAULT,
      value = BLANK,
      height,
      width,
      disabled = false,
      backgroundColor = WHITE,
      paddingLeft,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      ...props
    },
    ref
  ) => {
    return (
      <BorderInputContainer
        ref={ref}
        value={value}
        onKeyDown={onKeyDown}
        readOnly={readOnly}
        $isEditable={!readOnly}
        $borderColor={borderColor}
        $backgroundColor={backgroundColor}
        height={height}
        width={width}
        disabled={disabled}
        $disabled={disabled}
        $paddingLeft={paddingLeft}
        $borderTopLeftRadius={borderTopLeftRadius}
        $borderTopRightRadius={borderTopRightRadius}
        $borderBottomLeftRadius={borderBottomLeftRadius}
        $borderBottomRightRadius={borderBottomRightRadius}
        {...props}
      />
    );
  }
);

BorderInput.displayName = 'BorderInput';
export default BorderInput;
