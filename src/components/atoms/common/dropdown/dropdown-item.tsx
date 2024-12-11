import React from "react";
import styled from "styled-components";
import { BLACK, GRAY, MAIN } from "@/constants/styles/color";

const DropdownContainer = styled.div<{
  $isSelected: boolean;
}>`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  color: ${({ $isSelected }) => ($isSelected ? MAIN.DEFAULT : BLACK)};
  transition: background-color 0.3s ease;
  border-radius: 5px;
  padding: 10px;
  min-width: 100px;
  max-width: 280px;

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
    <DropdownContainer
      $isSelected={isSelected}
      onClick={() => onClick(item.value)}
    >
      {item.title}
    </DropdownContainer>
  );
};

export default DropdownItem;
