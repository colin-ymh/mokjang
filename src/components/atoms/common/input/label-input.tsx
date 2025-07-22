import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import BorderInput from '@/components/atoms/common/input/border-input';
import { InputProps } from '@/components/atoms/common/input/main-input';
import RequiredMark from '@/components/atoms/common/text/required-mark';
import { GRAY } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';

const LabelInputContainer = styled.div<{ $zIndex?: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  transition: all 0.3s ease;
  z-index: ${({ $zIndex }) => $zIndex};
`;

type LabelInputProps = InputProps & {
  label: string;
  zIndex?: number;
  borderColor?: string;
  // labelColor?: string;
  isRequired?: boolean;
};

// forwardRef 를 사용하여 ref 를 props 로 전달받을 수 있게
const LabelInput = forwardRef<HTMLInputElement, LabelInputProps>(
  ({ label, zIndex, borderColor, isRequired, ...props }, ref) => {
    return (
      <LabelInputContainer $zIndex={zIndex}>
        <MainText color={GRAY.DARK} size={SIZE.SMALL}>
          {label}
          {isRequired && <RequiredMark />}
        </MainText>
        <BorderInput
          ref={ref}
          onChange={props.onChange || undefined}
          borderColor={borderColor}
          {...props}
        />
      </LabelInputContainer>
    );
  }
);

export default LabelInput;
