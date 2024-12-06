import React, { InputHTMLAttributes, forwardRef } from "react";
import styled from "styled-components";

import { BLACK, GRAY, MAIN } from "@/constants/styles/color";
import { InputProps } from "@/components/atoms/common/input/main-input";

// 스타일 정의
const BorderInputContainer = styled.input<{ $borderColor: string }>`
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  padding: 12px 16px;
  border: ${({ $borderColor }) => `1px solid ${$borderColor}`};
  border-radius: 8px;
  color: ${BLACK};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border: 1px solid ${MAIN.DEFAULT};
  }
`;

// forwardRef 를 사용하여 ref 를 전달받을 수 있도록
const BorderInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      onKeyDown,
      readOnly = false,
      borderColor = GRAY.DEFAULT,
      value,
      ...props
    },
    ref,
  ) => {
    return (
      <BorderInputContainer
        ref={ref}
        value={value}
        onKeyDown={onKeyDown}
        readOnly={readOnly}
        $borderColor={borderColor}
        {...props}
      />
    );
  },
);

export default BorderInput;
