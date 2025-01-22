import React from 'react';
import styled from 'styled-components';
import { BLACK, GRAY, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ItemContainer = styled.div<{ $isFocused: boolean }>`
  display: flex;
  padding: 10px;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ $isFocused }) => $isFocused && GRAY.LIGHT};

  &:hover {
    background-color: ${GRAY.LIGHT};
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
};

const DropdownItem = ({
  isSelected,
  onClick,
  item,
  isFocused,
}: DropdownItemProps) => {
  return (
    <DropdownContainer>
      <ItemContainer onClick={() => onClick(item.value)} $isFocused={isFocused}>
        <MainText color={isSelected ? MAIN.DEFAULT : BLACK}>
          {item.title}
        </MainText>
      </ItemContainer>
    </DropdownContainer>
  );
};

export default DropdownItem;
