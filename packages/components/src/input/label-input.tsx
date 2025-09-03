import { forwardRef } from 'react';
import styled from 'styled-components';

import { MainText } from '@mokjang/components';
import { InputProps } from './main-input';
import { GRAY, SIZE } from '@mokjang/constants';
import { BorderInput } from './border-input';
import { RequiredMark } from '../text';

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
  icon?: React.ReactNode;
};

// forwardRef 를 사용하여 ref 를 props 로 전달받을 수 있게
export const LabelInput = forwardRef<HTMLInputElement, LabelInputProps>(
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
