import React from "react";
import styled from "styled-components";
import { BLACK, GRAY, MAIN } from "@/common/styles/color";

const DropdownContainer = styled.div<{
  $isSelected: boolean;
}>`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  color: ${({ $isSelected }) => ($isSelected ? MAIN.DEFAULT : BLACK)};
  transition: background-color 0.3s ease;
  border-radius: 10px;
  padding: 10px;
  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

export type DropdownValueType = {
  value: any;
  title: string;
};

type DropdownItemProps = {
  isSelected: boolean;
  item: DropdownValueType;
  index: number;
  onClick: (index: number) => void;
};

const DropdownItem = ({
  isSelected,
  onClick,
  item,
  index,
}: DropdownItemProps) => {
  return (
    <DropdownContainer $isSelected={isSelected} onClick={() => onClick(index)}>
      {item.title}
    </DropdownContainer>
  );
};

export default DropdownItem;
