import { ChangeEvent, Ref } from 'react';
import styled from 'styled-components';

import { useEducationSearchFilterDropdownItems } from '@/hooks/dropdown/dropdown-items';
import useWindowSize from '@/hooks/window/window';
import EducationFilteredItem, {
  EducationFilteredItemType,
} from '@/components/atoms/education/education/education-filtered-item';

import { EDUCATION } from '@/constants/education/education-column';
import SearchInput from '@/components/atoms/common/input/search-input';

const EducationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100px;
  flex-shrink: 0;
  position: relative;
`;

const RowTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-shrink: 0;
`;

const FilterList = styled.div`
  display: flex;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 10px 10px 20px;
  position: relative;
`;

const FilteredItemList = styled.div<{ $width: number }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
  padding: 10px 0;
  width: ${({ $width }) => $width}px;
  overflow-x: scroll;
`;

const SearchContainer = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  right: 20px;
  position: absolute;
`;

export type EDUCATION_SEARCH_FILTER = EDUCATION.NAME;

type EducationViewProps = {
  searchFilter: EDUCATION_SEARCH_FILTER;
  searchValue: string;
  searchRef: Ref<HTMLInputElement>;
  filteredItems: EducationFilteredItemType[];
  onClickSearchFilterItem: (value: EDUCATION_SEARCH_FILTER) => void;
  onChangeSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSearch: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const EducationRowView = ({
  searchFilter,
  searchValue,
  searchRef,
  filteredItems,
  onClickSearchFilterItem,
  onChangeSearchValue,
  onClickSearch,
  onKeyDown,
}: EducationViewProps) => {
  const searchFilterDropdownItems = useEducationSearchFilterDropdownItems();

  const { width } = useWindowSize();

  return (
    <EducationContainer>
      <RowTop>
        <FilterList>
          <ButtonContainer></ButtonContainer>
          {/* 필터 설정된 값들 */}
          <FilteredItemList $width={width - 650}>
            {filteredItems.map((item) => (
              <EducationFilteredItem key={item.title} item={item} />
            ))}
          </FilteredItemList>
        </FilterList>
        {/* 검색 부분 */}
        <SearchContainer>
          <SearchInput
            searchRef={searchRef}
            searchFilter={searchFilter}
            searchFilterDropdownItems={searchFilterDropdownItems}
            onClickSearchFilterItem={onClickSearchFilterItem}
            searchValue={searchValue}
            onChangeSearchValue={onChangeSearchValue}
            onKeyDown={onKeyDown}
            onClickSearch={onClickSearch}
          />
        </SearchContainer>
      </RowTop>
    </EducationContainer>
  );
};

export default EducationRowView;
