import React, { InputHTMLAttributes, forwardRef } from "react";
import styled from "styled-components";

import { BLACK, GRAY, MAIN } from "@/common/styles/color";

// 스타일 정의
const BorderInputContainer = styled.input<{ value: any }>`
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  padding: 12px 16px;
  border: ${({ value }: { value: string }) =>
    value ? `1px solid ${BLACK}` : `1px solid ${GRAY.DEFAULT}`};
  border-radius: 8px;
  color: ${BLACK};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border: 1px solid ${MAIN.DEFAULT};
  }
`;

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
};

// forwardRef를 사용하여 ref를 전달받을 수 있도록
const BorderInput = forwardRef<HTMLInputElement, InputProps>(
  ({ onKeyDown, readOnly = false, value, ...props }, ref) => {
    return (
      <BorderInputContainer
        ref={ref}
        value={value}
        onKeyDown={onKeyDown}
        readOnly={readOnly}
        {...props}
      />
    );
  },
);

export default BorderInput;
