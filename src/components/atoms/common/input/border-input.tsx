import React, { forwardRef } from "react";
import styled from "styled-components";

import { BLACK, GRAY, MAIN } from "@/constants/styles/color";
import { InputProps } from "@/components/atoms/common/input/main-input";

// 스타일 정의
const BorderInputContainer = styled.input<{
  $borderColor: string;
  height?: number;
  width?: number;
}>`
  width: ${({ width }) => (width ? `${width}px` : "100%")};

  box-sizing: border-box;
  font-size: 16px;
  padding: 12px 16px;
  border: ${({ $borderColor }) => `1px solid ${$borderColor}`};
  border-radius: 8px;
  color: ${BLACK};
  transition: all 0.3s ease;
  height: ${({ height }) => (height ? `${height}px` : "auto")};

  &:focus {
    outline: none;
    border: 1px solid ${MAIN.DEFAULT};
  }
`;

type BorderInputProps = InputProps & {
  borderColor?: string;
};

// forwardRef 를 사용하여 ref 를 전달받을 수 있도록
const BorderInput = forwardRef<HTMLInputElement, BorderInputProps>(
  (
    {
      onKeyDown,
      readOnly = false,
      borderColor = GRAY.DEFAULT,
      value,
      height,
      width,
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
        height={height}
        width={width}
        {...props}
      />
    );
  },
);

export default BorderInput;
