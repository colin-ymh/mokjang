import React, { ReactNode } from "react";
import styled from "styled-components";
import { MainText } from "@/components/atoms/common/text/main-text";
import { BLACK, DESTRUCTIVE, GRAY, MAIN, WHITE } from "@/common/styles/color";

interface ButtonProps {
  text?: string;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onClick?: (event: any) => void;
  width?: number;
  height?: number;
  type?:
    | "submit" // 보라색
    | "default" // 바탕:black 텍스트:white
    | "ghost" // 바탕:투명 텍스트:black
    | "secondary" // 바탕:gray 텍스트:black
    | "destructive" // 바탕:red 텍스트:white
    | "outline"; // 바탕:white 텍스트:black 테두리 O
  children?: ReactNode;
}

const ButtonContainer = styled.button<{
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  width?: number;
  height?: number;
  type?:
    | "submit"
    | "default"
    | "ghost"
    | "secondary"
    | "destructive"
    | "outline";
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ disabled, type }) => {
    switch (type) {
      case "default":
        return disabled ? GRAY.DARK : BLACK;
      case "destructive":
        return disabled ? DESTRUCTIVE.LIGHT : DESTRUCTIVE.DEFAULT;
      case "secondary":
        return disabled ? GRAY.LIGHT : GRAY.DEFAULT;
      case "outline":
      case "ghost":
        return "transparent";
      case "submit":
        return disabled ? MAIN.LIGHT : MAIN.DEFAULT;
      default:
        return disabled ? GRAY.DARK : BLACK;
    }
  }};
  color: ${({ type, disabled }) => {
    switch (type) {
      case "secondary":
      case "outline":
      case "ghost":
        return disabled ? GRAY.DEFAULT : BLACK;
      default:
        return WHITE;
    }
  }};
  width: ${({ width, size }) => {
    if (!width && !size) return "100%";
    if (width) return `${width}px`;
    switch (size) {
      case "small":
        return "80px";
      case "medium":
        return "120px";
      case "large":
        return "160px";
      default:
        return "120px";
    }
  }};
  height: ${({ height, size }) => {
    if (height) return height;
    switch (size) {
      case "small":
        return "30px";
      case "medium":
        return "40px";
      case "large":
        return "50px";
      default:
        return "40px";
    }
  }};
  // padding: 10px 20px;  // 패딩 수정 필요
  font-size: ${({ size }) => {
    switch (size) {
      case "small":
        return "12px";
      case "medium":
        return "16px";
      case "large":
        return "20px";
      default:
        return "16px";
    }
  }};
  border: ${({ type }) =>
    type === "outline" ? `solid ${GRAY.DEFAULT} 1px` : "none"};
  border-radius: 10px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const Button = ({
  text,
  size,
  disabled = false,
  onClick,
  width,
  height,
  type = "default",
  children,
}: ButtonProps) => {
  return (
    <ButtonContainer
      size={size}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      width={width}
      height={height}
      type={type}
    >
      {children ? children : text}
    </ButtonContainer>
  );
};

export default Button;
