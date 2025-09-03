import React from 'react';
import styled from 'styled-components';

import { BLACK, MAIN } from '@/constants/styles/color';
import { MainText } from '../text/main-text';

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ItemContainer = styled.div<{ $isFocused: boolean; $isRight?: boolean }>`
  display: flex;
  padding: 10px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  background-color: ${({ $isFocused }) => $isFocused && MAIN.EXTRA_LIGHT};
  justify-content: ${({ $isRight }) => $isRight && 'flex-end'};
  &:hover {
    background-color: ${MAIN.EXTRA_LIGHT};
  }
`;

export type DropdownValueType = {
  value: any;
  title: string;
};

type DropdownItemProps = {
  item: DropdownValueType;
  onClick: (index: number) => void;
  isSelected: boolean;
  isFocused: boolean;
  isRight?: boolean;
};

const DropdownItem = ({
  isSelected,
  onClick,
  item,
  isFocused,
  isRight,
}: DropdownItemProps) => {
  return (
    <DropdownContainer>
      <ItemContainer
        onClick={(event) => {
          event.stopPropagation();
          onClick(item.value);
        }}
        $isFocused={isFocused}
        $isRight={isRight}
      >
        <MainText color={isSelected ? MAIN.DEFAULT : BLACK}>
          {item.title}
        </MainText>
      </ItemContainer>
    </DropdownContainer>
  );
};

export default DropdownItem;
