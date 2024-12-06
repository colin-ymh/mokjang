import React, { InputHTMLAttributes, forwardRef } from "react";
import styled from "styled-components";
import { GRAY, MAIN } from "@/constants/styles/color";

// 스타일 정의
const MainInputContainer = styled.input`
  width: 100%;
  font-size: 16px;
  padding: 12px 16px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0);
  outline: none;

  &:focus {
    border-bottom: 1px solid ${MAIN.DEFAULT};
  }
`;

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
};

// forwardRef 를 사용하여 ref 를 전달받을 수 있도록
const MainInput = forwardRef<HTMLInputElement, InputProps>(
  ({ onKeyDown, readOnly = false, value, ...props }, ref) => {
    return (
      <MainInputContainer
        ref={ref}
        value={value}
        onKeyDown={onKeyDown}
        readOnly={readOnly}
        {...props}
      />
    );
  },
);

export default MainInput;
