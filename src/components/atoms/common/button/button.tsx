import React, { ReactNode } from "react";
import styled from "styled-components";

import {
  MainText,
  MainTextProps,
} from "@/components/atoms/common/text/main-text";
import { MAIN, WHITE } from "@/common/styles/color";

type ButtonProps = MainTextProps & {
  text?: string;
  disabled?: boolean;
  onClick?: (event: any) => void;
  width?: number;
  height?: number;
  backgroundColor?: string;
  color?: string;
  isShadow?: boolean;
  children?: ReactNode;
};

const ButtonContainer = styled.button<{
  disabled?: boolean;
  width?: number;
  height?: number;
  $backgroundColor?: string;
  $isShadow?: boolean; // `$` 접두사를 사용해야만 컴포넌트 속성으로 전달 가능
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  width: ${({ width }) => (width ? `${width}px` : `100%`)};
  height: ${({ height }) => (height ? `${height}px` : `100%`)};
  border-radius: 10px;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  box-shadow: ${({ $isShadow, disabled }) =>
    $isShadow && !disabled ? `2px 2px 10px rgba(0, 0, 0, 0.3)` : `none`};
  overflow: hidden;
`;

const Button = ({
  text,
  disabled = false,
  onClick,
  width,
  height,
  backgroundColor = MAIN.DEFAULT,
  isShadow = false,
  // text props
  color = WHITE,
  fontWeight,
  fontSize,
  children,
}: ButtonProps) => {
  return (
    <ButtonContainer
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      width={width}
      height={height}
      $backgroundColor={backgroundColor}
      $isShadow={isShadow}
    >
      {children ? (
        children
      ) : (
        <MainText color={color} fontWeight={fontWeight} fontSize={fontSize}>
          {text}
        </MainText>
      )}
    </ButtonContainer>
  );
};

export default Button;
