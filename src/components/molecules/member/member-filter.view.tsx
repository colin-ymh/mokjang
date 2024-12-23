import { ChangeEvent, Dispatch, SetStateAction } from "react";
import styled from "styled-components";

import Button from "@/components/atoms/common/button/button";
import { MainText } from "@/components/atoms/common/text/main-text";
import { GRAY, MAIN, WHITE } from "@/constants/styles/color";
import AddFilter from "@/components/molecules/member/add-filter";
import { MEDIA_MIN_WIDTH } from "@/constants/constant";
import Dropdown from "@/components/atoms/common/dropdown/dropdown";
import MainInput from "@/components/atoms/common/input/main-input";
import { SEARCH_FILTER } from "@/components/molecules/member/add-filter.view";
import { useSearchFilterDropdownItems } from "@/hooks/dropdown/dropdown-items";

import { useI18n } from "../../../../locales/client";
import BorderInput from "@/components/atoms/common/input/border-input";

const MemberFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  gap: 10px;
`;

const FilterList = styled.div`
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  align-items: center;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const AddFilterContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? "flex" : "none")};
  position: absolute;

  z-index: 10;
  background-color: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    top: 120px;
    right: 20px;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    top: 220px;
    right: 30px;
  }
`;

type MemberFilterViewProps = {
  isAddFilterShown: boolean;
  searchFilter: SEARCH_FILTER;
  searchValue: string;
  setIsAddFilterShown: Dispatch<SetStateAction<boolean>>;
  onClickSearchFilterItem: (value: SEARCH_FILTER) => void;
  onChangeSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickOpenFilter: () => void;
};

const MemberFilterView = ({
  isAddFilterShown,
  searchFilter,
  searchValue,
  setIsAddFilterShown,
  onClickOpenFilter,
  onClickSearchFilterItem,
  onChangeSearchValue,
}: MemberFilterViewProps) => {
  const t = useI18n();

  return (
    <MemberFilterContainer>
      <FilterList></FilterList>
      {/* 검색 부분 */}
      <SearchContainer>
        <Dropdown
          value={searchFilter}
          items={useSearchFilterDropdownItems()}
          onChangeItem={onClickSearchFilterItem}
          height={40}
          width={100}
          borderColor={GRAY.DEFAULT}
        />
        <BorderInput
          value={searchValue}
          onChange={onChangeSearchValue}
          height={40}
        />
        <Button text={"검색"} width={100} height={40} />
      </SearchContainer>
      {/* 필터 추가 모달 */}
      <AddFilterContainer $isShown={isAddFilterShown}>
        <AddFilter setIsShown={setIsAddFilterShown} />
      </AddFilterContainer>
    </MemberFilterContainer>
  );
};

export default MemberFilterView;
