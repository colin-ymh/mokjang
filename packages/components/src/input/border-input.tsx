'use client';

import { forwardRef } from 'react';
import styled from 'styled-components';

import { BLACK, BLANK, GRAY, MAIN, SIZE, WHITE } from '@mokjang/constants';
import { InputProps } from './main-input';
import { MainText } from '@mokjang/components';

const BorderInputContainer = styled.input<{
  $isEditable: boolean;
  $borderColor: string;
  height?: number;
  width?: number | 'auto';
  color?: string;
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
  width: ${({ width }) =>
    width === 'auto' ? 'auto' : width ? `${width}px` : '100%'};
  box-sizing: border-box;
  font-size: ${({ $fontSize }) => `${$fontSize}px`};
  font-weight: ${({ $fontWeight }) => `${$fontWeight}` || '400'};
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
  color: ${({ color }) => color || BLACK};
  transition: border 0.3s ease;
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
  pointer-events: ${({ $isEditable }) => ($isEditable ? 'auto' : 'none')};
  background-color: ${({ $disabled, $backgroundColor }) =>
    $disabled ? GRAY.EXTRA_LIGHT : $backgroundColor || WHITE};

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
  gap: 10px;
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

const CharCounter = styled.div<{ $disabled?: boolean }>`
  position: absolute;
  right: 0;
  bottom: -18px;
  color: ${({ $disabled }) => ($disabled ? GRAY.DEFAULT : GRAY.DARK)};
  background: transparent;
  pointer-events: none;
`;

export type BorderInputProps = InputProps & {
  borderColor?: string;
  height?: number;
  width?: number | 'auto';
  backgroundColor?: string;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  readOnly?: boolean;
  fontSize?: number;
  fontWeight?: number;
  isRight?: boolean;
  maxLength?: number;
  icon?: React.ReactNode;
  color?: string;
};

export const BorderInput = forwardRef<HTMLInputElement, BorderInputProps>(
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
      color,
      maxLength,
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
          color={color}
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
        {typeof maxLength === 'number' && (
          <CharCounter $disabled={disabled}>
            <MainText color={GRAY.DEFAULT} size={SIZE.SMALL}>
              {value.toString().length}/{maxLength}
            </MainText>
          </CharCounter>
        )}
      </InputWrapper>
    );
  }
);
