import React from 'react';
import styled from 'styled-components';
import { BLACK, GRAY, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ItemContainer = styled.div`
  display: flex;
  padding: 10px;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${GRAY.DEFAULT};
  }
`;

export type DropdownValueType = {
  value: any;
  title: string;
};

type DropdownItemProps = {
  isSelected: boolean;
  item: DropdownValueType;
  onClick: (index: number) => void;
};

const DropdownItem = ({ isSelected, onClick, item }: DropdownItemProps) => {
  return (
    <DropdownContainer>
      <ItemContainer onClick={() => onClick(item.value)}>
        <MainText color={isSelected ? MAIN.DEFAULT : BLACK}>
          {item.title}
        </MainText>
      </ItemContainer>
    </DropdownContainer>
  );
};

export default DropdownItem;
