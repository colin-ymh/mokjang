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
  $fontSize?: number;
  $fontWeight?: number;
  $isRight?: boolean;
  $isIcon?: boolean;
}>`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  box-sizing: border-box;
  font-size: ${({ $fontSize }) => `${$fontSize}px`};
  font-weight: ${({ $fontWeight }) => `${$fontWeight}px` || '400'};
  text-align: ${({ $isRight }) => ($isRight ? 'right' : 'left')};
  font-family: 'Roboto', sans-serif;
  padding: 10px;
  padding-left: ${({ $paddingLeft, $isIcon }) =>
    $paddingLeft !== undefined
      ? `${$paddingLeft}px`
      : $isIcon
        ? '36px'
        : '10px'};
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

  &::placeholder {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    color: ${GRAY.DEFAULT};
  }
  &::-webkit-input-placeholder {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    color: ${GRAY.DEFAULT};
  }
  &::-moz-placeholder {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    color: ${GRAY.DEFAULT};
  }
  &:-ms-input-placeholder {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    color: ${GRAY.DEFAULT};
  }
  &:-moz-placeholder {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    color: ${GRAY.DEFAULT};
  }

  &:focus {
    outline: none;
    border: 1px solid ${MAIN.DEFAULT};
  }
`;

const InputWrapper = styled.div`
  position: relative;
  align-items: center;
  width: 100%;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; // 클릭 이벤트 방지
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
  fontSize?: number;
  fontWeight?: number;
  isRight?: boolean;
  icon?: React.ReactNode;
};

const BorderInput = forwardRef<HTMLInputElement, BorderInputProps>(
  (
    {
      onKeyDown,
      readOnly = false,
      borderColor = GRAY.LIGHT,
      value = BLANK,
      height = 40,
      width,
      disabled = false,
      backgroundColor = WHITE,
      paddingLeft,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      fontSize = 14,
      fontWeight,
      isRight,
      icon,
      ...props
    },
    ref
  ) => {
    return (
      <InputWrapper>
        {icon && <IconWrapper>{icon}</IconWrapper>}
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
          $fontSize={fontSize}
          $fontWeight={fontWeight}
          $isRight={isRight}
          $isIcon={!!icon}
          {...props}
        />
      </InputWrapper>
    );
  }
);

BorderInput.displayName = 'BorderInput';
export default BorderInput;
