import { ChangeEvent, Dispatch, SetStateAction } from "react";
import styled from "styled-components";

import Button from "@/components/atoms/common/button/button";
import { GRAY } from "@/constants/styles/color";
import TableSetting from "@/components/molecules/member/list/table-setting";
import { MEDIA_MIN_WIDTH } from "@/constants/constant";
import Dropdown from "@/components/atoms/common/dropdown/dropdown";
import BorderInput from "@/components/atoms/common/input/border-input";
import { useSearchFilterDropdownItems } from "@/hooks/dropdown/dropdown-items";
import { MEMBER } from "@/constants/member/member-column";

import { useI18n, useScopedI18n } from "../../../../../locales/client";
import TransparentBackground from "@/components/atoms/common/etc/transparent-background";

const MemberFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  gap: 10px;
`;

const FilterList = styled.div`
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  align-items: center;
  position: relative;
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

  top: 40px;

  // @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
  //   top: 120px;
  //   right: 20px;
  // }

  //@media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
  //  top: 220px;
  //  right: 30px;
  //}
`;

export type SEARCH_FILTER = MEMBER.NAME | MEMBER.SCHOOL | MEMBER.VEHICLE_NUMBER;

type MemberFilterViewProps = {
  isAddFilterShown: boolean;
  searchFilter: SEARCH_FILTER;
  searchValue: string;
  setIsAddFilterShown: Dispatch<SetStateAction<boolean>>;
  onClickSearchFilterItem: (value: SEARCH_FILTER) => void;
  onChangeSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickTableSetting: () => void;
  onClickSearch: () => void;
};

const MemberFilterRowView = ({
  isAddFilterShown,
  searchFilter,
  searchValue,
  setIsAddFilterShown,
  onClickTableSetting,
  onClickSearchFilterItem,
  onChangeSearchValue,
  onClickSearch,
}: MemberFilterViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n("button");

  const searchFilterDropdownItems = useSearchFilterDropdownItems();

  return (
    <MemberFilterContainer>
      <FilterList>
        {/* 설정 활성화 버튼 */}
        <Button
          text={t_button("filterSetting")}
          height={30}
          onClick={onClickTableSetting}
        />

        {/* 필터 추가 모달 */}
        <AddFilterContainer $isShown={isAddFilterShown}>
          <TransparentBackground
            isOpened={isAddFilterShown}
            onClick={() => setIsAddFilterShown(false)}
            blur={false}
          />
          <TableSetting setIsShown={setIsAddFilterShown} />
        </AddFilterContainer>
      </FilterList>
      {/* 검색 부분 */}
      <SearchContainer>
        <Dropdown
          value={searchFilter}
          items={searchFilterDropdownItems}
          onChangeItem={onClickSearchFilterItem}
          height={30}
          width={80}
          borderColor={GRAY.LIGHT}
        />
        <BorderInput
          value={searchValue}
          onChange={onChangeSearchValue}
          borderColor={GRAY.LIGHT}
          height={30}
        />
        <Button
          text={t("search")}
          width={80}
          height={30}
          onClick={onClickSearch}
        />
      </SearchContainer>
    </MemberFilterContainer>
  );
};

export default MemberFilterRowView;
