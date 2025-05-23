import React from 'react';
import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, MAIN } from '@/constants/styles/color';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import Check from '../../../../../public/svg/check.svg';

const FilterContainer = styled.div`
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  padding: 10px 0;
`;

const FilterItemContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterItem = styled.div`
  display: flex;
  padding: 5px 10px;
  margin: 5px 0;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${GRAY.SEMI_LIGHT};
  }
`;

const ItemDivideLine = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${GRAY.SEMI_LIGHT};
`;

const CheckButton = styled(Check)<{ $isSelected: boolean }>`
  display: flex;
  stroke: ${({ $isSelected }) => ($isSelected ? MAIN.DEFAULT : GRAY.DEFAULT)};
  transition: stroke 0.2s ease-in-out;
`;

type FilterItemListProps = {
  items: DropdownValueType[];
  filterItems: string[];
  onClickFilterItem: (value: string) => void;
};

const FilterItemList = ({
  items,
  filterItems,
  onClickFilterItem,
}: FilterItemListProps) => {
  return (
    <FilterContainer>
      {items?.map((item) => {
        return (
          <FilterItemContainer key={item.value}>
            <FilterItem onClick={() => onClickFilterItem(item.value)}>
              <MainText>{item.title}</MainText>
              <CheckButton $isSelected={filterItems?.includes(item.value)} />
            </FilterItem>
            <ItemDivideLine />
          </FilterItemContainer>
        );
      })}
    </FilterContainer>
  );
};

export default FilterItemList;
