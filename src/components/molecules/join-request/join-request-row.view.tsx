import { ChangeEvent, Ref } from 'react';
import styled from 'styled-components';
import useWindowSize from '@/hooks/window/window';
import SearchInput from '@/components/atoms/common/input/search-input';
import { JOIN_REQUEST_STATUS } from '@/constants/status/status';
import JoinRequestFilteredItem, {
  JoinRequestFilteredItemType,
} from '@/components/atoms/join-request/join-request-filtered-item';
import { JOIN_REQUEST } from '@/constants/column/join-request-column';
import {
  useJoinRequestSearchFilterDropdownItems,
  useJoinRequestStatusFilterDropdownItems,
} from '@/hooks/dropdown/dropdown-items';

const JoinRequestContainer = styled.div`
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

export type JOIN_REQUEST_SEARCH_FILTER = JOIN_REQUEST.NAME;

type JoinRequestViewProps = {
  isModalShown: boolean;
  searchFilter: JOIN_REQUEST_SEARCH_FILTER;
  searchValue: string;
  searchRef: Ref<HTMLInputElement>;
  statusFilter: JOIN_REQUEST_STATUS | undefined;
  filteredItems: JoinRequestFilteredItemType[];
  onClickStatusFilterItem: (value: JOIN_REQUEST_STATUS) => void;
  onClickClosePeriodModal: () => void;
  onClickSearchFilterItem: (value: JOIN_REQUEST_SEARCH_FILTER) => void;
  onChangeSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickPeriodModal: () => void;
  onClickSearch: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClickSavePeriod: (startDate: string, endDate: string) => void;
};

const JoinRequestequestRowView = ({
  isModalShown,
  searchFilter,
  searchValue,
  searchRef,
  statusFilter,
  filteredItems,
  onClickStatusFilterItem,
  onClickClosePeriodModal,
  onClickPeriodModal,
  onClickSearchFilterItem,
  onChangeSearchValue,
  onClickSearch,
  onKeyDown,
  onClickSavePeriod,
}: JoinRequestViewProps) => {
  const searchFilterDropdownItems = useJoinRequestSearchFilterDropdownItems();
  const statusFilterDropdownItems = useJoinRequestStatusFilterDropdownItems();

  const { width } = useWindowSize();

  return (
    <JoinRequestContainer>
      <RowTop>
        <FilterList>
          <ButtonContainer></ButtonContainer>
          {/* 필터 설정된 값들 */}
          <FilteredItemList $width={width - 650}>
            {filteredItems.map((item) => (
              <JoinRequestFilteredItem
                key={`${item.title}-${item.value?.join?.('-') ?? ''}`}
                item={item}
              />
            ))}
          </FilteredItemList>
        </FilterList>
        {/* 검색 부분 */}
        <SearchContainer>
          {/*<StatusDropdown*/}
          {/*  value={statusFilter}*/}
          {/*  items={statusFilterDropdownItems}*/}
          {/*  onChangeItem={onClickStatusFilterItem}*/}
          {/*  height={30}*/}
          {/*  width={130}*/}
          {/*  borderColor={GRAY.SEMI_LIGHT}*/}
          {/*  backgroundBlur={false}*/}
          {/*/>*/}
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
    </JoinRequestContainer>
  );
};

export default JoinRequestequestRowView;
