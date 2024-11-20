"use client";

import styled from "styled-components";

import { GRAY, WHITE } from "@/common/styles/color";
import DropdownItem, {
  DropdownValueType,
} from "@/components/atoms/common/dropdown/dropdown-item";
import BorderInput from "@/components/atoms/common/input/border-input";

const DropdownContainer = styled.div`
  width: 100%;
  position: relative;
`;

const DropdownButton = styled.div<{
  $reverseDirection?: boolean;
}>`
  display: flex;
  width: 100%;
  flex-direction: ${({ $reverseDirection }) =>
    $reverseDirection ? "row-reverse" : "row"};
`;

const DropdownList = styled.div`
  position: absolute;
  width: 100%;
  z-index: 50;
  margin-top: 10px;
  border-radius: 10px;
  background-color: ${WHITE};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  div:hover {
    background-color: ${GRAY.LIGHT}; /* Hover 색상 */
  }
`;

type DropdownViewProps = {
  items: DropdownValueType[];
  valueIndex: number;
  isOpened: boolean;
  onClickDropdown: () => void;
  onClickItem: (index: number) => void;
  reverseDirection?: boolean;
};

const DropdownView = ({
  //
  items,
  valueIndex,
  //
  isOpened,
  onClickDropdown,
  onClickItem,
  //
  reverseDirection,
}: DropdownViewProps) => {
  return (
    <DropdownContainer>
      <DropdownButton
        $reverseDirection={reverseDirection}
        onClick={onClickDropdown}
      >
        <BorderInput value={items[valueIndex].title} onChange={() => {}} />
      </DropdownButton>

      {isOpened && (
        <DropdownList>
          {items.map((item, index) => (
            <DropdownItem
              key={index}
              isSelected={index === valueIndex}
              item={item}
              index={index}
              onClick={onClickItem}
            />
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default DropdownView;
