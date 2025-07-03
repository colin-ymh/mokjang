import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { BLACK, GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { BLANK } from '@/constants/constant';

const StyledTextarea = styled.textarea<{
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
  height: ${({ height }) => (height ? `${height}px` : '100%')};
  background-color: ${({ $disabled, $backgroundColor }) =>
    $backgroundColor ? $backgroundColor : $disabled ? GRAY.SEMI_LIGHT : WHITE};
  resize: none;

  &:focus {
    outline: none;
    border: 1px solid ${MAIN.DEFAULT};
  }
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
      ...props
    },
    ref
  ) => {
    return (
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
    );
  }
);

export default BorderTextarea;
