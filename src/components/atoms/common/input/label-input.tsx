import React, { InputHTMLAttributes, forwardRef } from "react";
import styled from "styled-components";

import { MainText } from "@/components/atoms/common/text/main-text";
import BorderInput from "@/components/atoms/common/input/border-input";

const LabelInputContainer = styled.div<{ $zIndex?: number }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  transition: all 0.3s ease;
  z-index: ${({ $zIndex }) => $zIndex};
`;

type LabelInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  zIndex?: number;
  borderColor?: string;
};

// forwardRef 를 사용하여 ref 를 props 로 전달받을 수 있게
const LabelInput = forwardRef<HTMLInputElement, LabelInputProps>(
  ({ label, zIndex, borderColor, ...props }, ref) => {
    return (
      <LabelInputContainer $zIndex={zIndex}>
        <MainText>{label}</MainText>
        <BorderInput
          ref={ref}
          onChange={props.onChange || undefined}
          borderColor={borderColor}
          {...props}
        />
      </LabelInputContainer>
    );
  },
);

export default LabelInput;
