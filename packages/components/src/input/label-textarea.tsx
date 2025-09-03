import { forwardRef } from 'react';
import styled from 'styled-components';

import { MainText } from '../text/main-text';
import BorderTextarea from './border-textarea';
import { GRAY, SIZE } from '@mokjang/constants';

const LabelTextareaContainer = styled.div<{ $zIndex?: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 10px;
  transition: all 0.3s ease;
  z-index: ${({ $zIndex }) => $zIndex};
`;

type LabelTextareaProps = {
  label: string;
  zIndex?: number;
  borderColor?: string;
  height?: number;
  width?: number;
  backgroundColor?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  maxLength?: number;
};

// forwardRef 를 사용하여 ref 를 props 로 전달받을 수 있게
export const LabelTextarea = forwardRef<
  HTMLTextAreaElement,
  LabelTextareaProps
>(({ label, zIndex, borderColor, ...props }, ref) => {
  return (
    <LabelTextareaContainer $zIndex={zIndex}>
      <MainText color={GRAY.DARK} size={SIZE.SMALL}>
        {label}
      </MainText>
      <BorderTextarea ref={ref} borderColor={borderColor} {...props} />
    </LabelTextareaContainer>
  );
});
