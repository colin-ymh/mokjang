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
  children?: ReactNode;
};

const ButtonContainer = styled.button<{
  disabled?: boolean;
  width?: number;
  height?: number;
  $backgroundColor?: string;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ $backgroundColor }) => {
    return $backgroundColor;
  }};
  width: ${({ width }) => {
    if (width) return `${width}px`;
    else return `100%`;
  }};
  height: ${({ height }) => {
    if (height) return `${height}px`;
    else return `100%`;
  }};
  border-radius: 10px;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 1s ease;
`;

const Button = ({
  text,
  disabled = false,
  onClick,
  width,
  height,
  backgroundColor = MAIN.DEFAULT,
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
