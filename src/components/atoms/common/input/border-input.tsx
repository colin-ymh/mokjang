import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { BLACK, GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { InputProps } from '@/components/atoms/common/input/main-input';
import { BLANK } from '@/constants/constant';

// 스타일 정의
const BorderInputContainer = styled.input<{
  $isEditable: boolean;
  $borderColor: string;
  height?: number;
  width?: number;
  $disabled?: boolean;
  $backgroundColor?: string;
}>`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  box-sizing: border-box;
  font-size: 14px;
  padding: 10px 15px;
  border: ${({ $borderColor }) => `1px solid ${$borderColor}`};
  border-radius: 5px;
  color: ${BLACK};
  transition: all 0.3s ease;
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
  pointer-events: ${({ $isEditable }) => ($isEditable ? 'auto' : 'none')};
  background-color: ${({ $disabled, $backgroundColor }) =>
    $backgroundColor ? $backgroundColor : $disabled ? GRAY.LIGHT : WHITE};

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

// forwardRef 를 사용하여 ref 를 전달받을 수 있도록
const BorderInput = forwardRef<HTMLInputElement, BorderInputProps>(
  (
    {
      onKeyDown,
      readOnly = false,
      borderColor = GRAY.DEFAULT,
      value = BLANK,
      height,
      width,
      disabled,
      backgroundColor = WHITE,
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
        $disabled={disabled}
        {...props}
      />
    );
  }
);

export default BorderInput;
