import React from 'react';
import styled from 'styled-components';

import BorderInput, {
  BorderInputProps,
} from '@/components/atoms/common/input/border-input';
import { BLACK, WHITE } from '@/constants/styles/color';

import ChevronLeft from '../../../../../public/svg/chevron-down.svg';

const DropdownButton = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  position: relative;
`;

const Chevron = styled(ChevronLeft)<{ $isOpened: boolean }>`
  width: 18px;
  height: 18px;
  stroke: ${BLACK};
  stroke-width: 1px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%)
    rotate(${({ $isOpened }) => ($isOpened ? '180deg' : '360deg')});
  transition: transform 0.2s ease;
`;

type FakeDropdownButtonProps = BorderInputProps & {
  isOpened: boolean;
  title: string;
  onClick: () => void;
};

const FakeDropdownButton = ({
  isOpened,
  title,
  onClick,
  ...props
}: FakeDropdownButtonProps) => {
  return (
    <DropdownButton onClick={onClick}>
      <BorderInput
        value={title}
        readOnly={true}
        backgroundColor={WHITE}
        {...props}
      />
      <Chevron $isOpened={isOpened} />
    </DropdownButton>
  );
};

export default FakeDropdownButton;
