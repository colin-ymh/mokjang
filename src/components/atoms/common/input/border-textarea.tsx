import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { BLACK, GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { BLANK } from '@/constants/constant';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';

const StyledTextarea = styled.textarea<{
  $borderColor: string;
  height?: number;
  width?: number;
  color?: string;
  $disabled?: boolean;
  $backgroundColor?: string;
  $paddingLeft?: number;
}>`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 400;
  font-family: 'Roboto', sans-serif;
  padding: 10px;
  padding-left: ${({ $paddingLeft }) =>
    $paddingLeft !== undefined ? `${$paddingLeft}px` : '10px'};
  border: 1px solid ${({ $borderColor }) => $borderColor};
  color: ${({ color }) => color || BLACK};
  transition: border 0.3s ease;
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
  background-color: ${({ $disabled, $backgroundColor }) =>
    $disabled ? GRAY.SEMI_LIGHT : $backgroundColor || WHITE};

  border-radius: 5px;

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

const CharCounter = styled.div<{ $disabled?: boolean }>`
  position: absolute;
  right: 0;
  bottom: -18px;
  color: ${({ $disabled }) => ($disabled ? GRAY.DEFAULT : GRAY.DARK)};
  background: transparent;
  pointer-events: none;
`;

type BorderTextareaProps = {
  borderColor?: string;
  height?: number;
  width?: number;
  backgroundColor?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
};

// forwardRef 를 사용하여 ref 를 전달받을 수 있도록
const BorderTextarea = forwardRef<HTMLTextAreaElement, BorderTextareaProps>(
  (
    {
      borderColor = GRAY.DEFAULT,
      value = BLANK,
      height,
      width,
      disabled,
      backgroundColor = WHITE,
      onChange,
      placeholder,
      readOnly = false,
      onBlur,
      maxLength,
      ...props
    },
    ref
  ) => {
    return (
      <InputWrapper>
        <StyledTextarea
          ref={ref}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          $borderColor={borderColor}
          $backgroundColor={backgroundColor}
          height={height}
          width={width}
          $disabled={disabled}
          placeholder={placeholder}
          onBlur={onBlur}
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

export default BorderTextarea;
