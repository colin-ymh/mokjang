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
}>`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  box-sizing: border-box;
  font-size: 14px;
  padding: 10px;
  padding-left: ${({ $paddingLeft }) => `${$paddingLeft}px` || '30'};
  border: 1px solid ${({ $borderColor }) => $borderColor};
  border-radius: 5px;
  color: ${BLACK};
  transition: all 0.3s ease;
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
  pointer-events: ${({ $isEditable }) => ($isEditable ? 'auto' : 'none')};
  background-color: ${({ $disabled, $backgroundColor }) =>
    $disabled ? GRAY.SEMI_LIGHT : $backgroundColor || WHITE};

  &:focus {
    outline: none;
    border: 1px solid ${MAIN.DEFAULT};
  }
`;

type BorderInputProps = InputProps & {
  borderColor?: string;
  height?: number;
  width?: number;
  backgroundColor?: string;
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
        {...props}
      />
    );
  }
);

BorderInput.displayName = 'BorderInput';
export default BorderInput;
