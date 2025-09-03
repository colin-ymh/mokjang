import { forwardRef, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

import { BLACK, MAIN } from '@mokjang/constants';

// 스타일 정의
const MainInputContainer = styled.input<{
  $width?: number;
  $height?: number;
  $color?: string;
  $backgroundColor?: string;
  $borderBottomColor?: string;
  $isReadOnly?: boolean;
  $paddingLeft?: number;
}>`
  width: ${({ $width }) => ($width ? `${$width}px` : '100%')};
  font-size: 14px;
  padding: 10px;
  padding-left: ${({ $paddingLeft }) => $paddingLeft || 'auto'};
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0);
  outline: none;
  height: ${({ $height }) => ($height ? `${$height}px` : 'auto')};
  color: ${({ $color }) => $color || BLACK};
  background-color: ${({ $backgroundColor }) => $backgroundColor || 'auto'};
  position: relative;
  cursor: ${({ $isReadOnly }) => ($isReadOnly ? 'default' : 'auto')};

  &:focus {
    border-bottom: ${({ $borderBottomColor }) =>
      `1px solid ${$borderBottomColor || MAIN.DEFAULT}`};
  }
`;

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  height?: number;
  width?: number;
  color?: string;
  backgroundColor?: string;
  onClick?: (event: any) => void;
  borderBottomColor?: string;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  paddingLeft?: number;
};

// forwardRef 를 사용하여 ref 를 전달받을 수 있도록
export const MainInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      onKeyDown,
      readOnly = false,
      value,
      height,
      width,
      color,
      backgroundColor,
      onClick,
      borderBottomColor,
      onFocus,
      onBlur,
      paddingLeft,
      ...props
    },
    ref
  ) => {
    return (
      <MainInputContainer
        ref={ref}
        value={value}
        onClick={onClick}
        $height={height}
        $width={width}
        $color={color}
        $backgroundColor={backgroundColor}
        $borderBottomColor={borderBottomColor}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        $isReadOnly={readOnly}
        readOnly={readOnly}
        $paddingLeft={paddingLeft}
        {...props}
      />
    );
  }
);
