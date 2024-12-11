import styled from "styled-components";
import { MainText } from "@/components/atoms/common/text/main-text";
import { GRAY } from "@/constants/styles/color";
import { useI18n } from "../../../../locales/client";
import { MEMBER } from "@/constants/member/member-column";
import BorderInput from "@/components/atoms/common/input/border-input";
import { ChangeEvent } from "react";
import Dropdown from "@/components/atoms/common/dropdown/dropdown";
import {
  useBaptismDropdownItems,
  useGenderDropdownItems,
  useOfficerDropdownItems,
  useSearchFilterDropdownItems,
} from "@/hooks/dropdown/dropdown-items";
import MainInput from "@/components/atoms/common/input/main-input";
import Button from "@/components/atoms/common/button/button";
import { BAPTISM, GENDER, NONE, NULL } from "@/constants/constant";

const AddFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 250px;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid ${GRAY.DEFAULT};
`;

const Icon = styled.div`
  width: 15px;
  height: 15px;
  background-color: ${GRAY.DEFAULT};
`;

const FilterItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${GRAY.DEFAULT};
`;

const FilterTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 10px;
`;

const FilterContentContainer = styled.div<{ $isOpened: boolean }>`
  display: ${({ $isOpened }) => ($isOpened ? "flex" : "none")};
  padding: 10px;
  flex-direction: column;
  gap: 10px;
`;

const SearchButton = styled.div`
  display: flex;
  width: 100%;
  padding-top: 10px;
`;

export type SEARCH_FILTER = MEMBER.NAME | MEMBER.SCHOOL | MEMBER.VEHICLE_NUMBER;

export type NONE_SEARCH_FILTER =
  | MEMBER.BIRTH
  | MEMBER.GENDER
  | MEMBER.GROUP
  | MEMBER.BAPTISM
  | MEMBER.OFFICER
  | typeof NULL;

type AddFilterViewProps = {
  searchFilter: SEARCH_FILTER;
  searchValue: string;
  openedFilter: NONE_SEARCH_FILTER;
  birthAfter: string;
  birthBefore: string;
  gender: GENDER | typeof NULL;
  baptism: BAPTISM | typeof NULL;
  officer: string | typeof NULL;
  onClickFilterTitle: (value: NONE_SEARCH_FILTER) => void;
  onClickSearchFilterItem: (value: SEARCH_FILTER) => void;
  onChangeSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeBirthAfter: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeBirthBefore: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGender: (value: GENDER | typeof NULL) => void;
  onChangeBaptism: (value: BAPTISM | typeof NULL) => void;
  onChangeOfficer: (value: string | typeof NULL) => void;
  onClickSearch: () => void;
  onClickClose: () => void;
  onClickReset: () => void;
};

const AddFilterView = ({
  searchFilter,
  searchValue,
  openedFilter,
  birthAfter,
  birthBefore,
  gender,
  baptism,
  officer,
  onClickFilterTitle,
  onClickSearchFilterItem,
  onChangeSearchValue,
  onChangeBirthAfter,
  onChangeBirthBefore,
  onChangeGender,
  onChangeBaptism,
  onChangeOfficer,
  onClickSearch,
  onClickClose,
  onClickReset,
}: AddFilterViewProps) => {
  const t = useI18n();

  return (
    <AddFilterContainer>
      <Header>
        <Button text={"리셋"} onClick={onClickReset} />
        <Button text={"닫기"} onClick={onClickClose} />
      </Header>
      {/* 검색 부분 */}
      <SearchContainer>
        <Dropdown
          value={searchFilter}
          items={useSearchFilterDropdownItems()}
          onChangeItem={onClickSearchFilterItem}
          height={40}
          borderColor={GRAY.DEFAULT}
        />
        <MainInput
          value={searchValue}
          onChange={onChangeSearchValue}
          height={40}
        />
      </SearchContainer>
      {/* 필터 항목들 */}
      {/* 생년월일 */}
      <FilterItem>
        <FilterTitleContainer onClick={() => onClickFilterTitle(MEMBER.BIRTH)}>
          <Icon />
          <MainText>{t(MEMBER.BIRTH)}</MainText>
        </FilterTitleContainer>
        <FilterContentContainer $isOpened={openedFilter === MEMBER.BIRTH}>
          <BorderInput value={birthAfter} onChange={onChangeBirthAfter} />
          <BorderInput value={birthBefore} onChange={onChangeBirthBefore} />
        </FilterContentContainer>
      </FilterItem>
      {/* 성별 */}
      <FilterItem>
        <FilterTitleContainer onClick={() => onClickFilterTitle(MEMBER.GENDER)}>
          <Icon />
          <MainText>{t(MEMBER.GENDER)}</MainText>
        </FilterTitleContainer>
        <FilterContentContainer $isOpened={openedFilter === MEMBER.GENDER}>
          <Dropdown
            value={gender}
            items={[
              ...useGenderDropdownItems(),
              { value: NULL, title: t(NULL) },
            ]}
            onChangeItem={onChangeGender}
          />
        </FilterContentContainer>
      </FilterItem>
      {/* 신급 */}
      <FilterItem>
        <FilterTitleContainer
          onClick={() => onClickFilterTitle(MEMBER.BAPTISM)}
        >
          <Icon />
          <MainText>{t(MEMBER.BAPTISM)}</MainText>
        </FilterTitleContainer>
        <FilterContentContainer $isOpened={openedFilter === MEMBER.BAPTISM}>
          <Dropdown
            value={baptism}
            items={useBaptismDropdownItems()}
            onChangeItem={onChangeBaptism}
          />
        </FilterContentContainer>
      </FilterItem>
      {/* 직분 */}
      <FilterItem>
        <FilterTitleContainer
          onClick={() => onClickFilterTitle(MEMBER.OFFICER)}
        >
          <Icon />
          <MainText>{t(MEMBER.OFFICER)}</MainText>
        </FilterTitleContainer>
        <FilterContentContainer $isOpened={openedFilter === MEMBER.OFFICER}>
          <Dropdown
            value={officer}
            items={useOfficerDropdownItems()}
            onChangeItem={onChangeOfficer}
          />
        </FilterContentContainer>
      </FilterItem>

      <SearchButton>
        <Button text={"검색하기"} height={30} onClick={onClickSearch} />
      </SearchButton>
    </AddFilterContainer>
  );
};

export default AddFilterView;
