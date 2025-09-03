import React from 'react';
import styled from 'styled-components';

import { BorderInput, BorderInputProps } from '@mokjang/components';
import { WHITE } from '@mokjang/constants';
import { Chevron } from '../dropdown/dropdown-chevron';

const DropdownButton = styled.div<{ width?: number }>`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  position: relative;
  width: ${({ width }) => (width ? `${width}px` : '100%')};
`;

type FakeDropdownButtonProps = BorderInputProps & {
  isOpened: boolean;
  title: string;
  onClick: () => void;
  width?: number;
};

const FakeDropdownButton = ({
  isOpened,
  title,
  onClick,
  width,
  ...props
}: FakeDropdownButtonProps) => {
  return (
    <DropdownButton onClick={onClick} width={width}>
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
