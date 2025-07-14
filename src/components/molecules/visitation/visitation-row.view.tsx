import { ChangeEvent, Ref } from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/common/button/button';
import { GRAY, WHITE } from '@/constants/styles/color';
import { VISITATION } from '@/constants/column/visitation-column';

import {
  useVisitationSearchFilterDropdownItems,
  useVisitationStatusFilterDropdownItems,
} from '@/hooks/dropdown/dropdown-items';
import useWindowSize from '@/hooks/window/window';
import { useScopedI18n } from '../../../../locales/client';
import VisitationFilteredItem, {
  VisitationFilteredItemType,
} from '@/components/atoms/visitation/visitation-filtered-item';
import PeriodModal from '@/components/atoms/common/modal/period-modal';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import SearchInput from '@/components/atoms/common/input/search-input';
import { VISITATION_STATUS } from '@/constants/status/status';

const VisitationContainer = styled.div`
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

export type VISITATION_SEARCH_FILTER = VISITATION.TITLE | VISITATION.IN_CHARGE;

type VisitationViewProps = {
  isModalShown: boolean;
  statusFilter: VISITATION_STATUS | undefined;
  searchFilter: VISITATION_SEARCH_FILTER;
  searchValue: string;
  searchRef: Ref<HTMLInputElement>;
  filteredItems: VisitationFilteredItemType[];
  onClickStatusFilterItem: (value: VISITATION_STATUS) => void;
  onClickSearchFilterItem: (value: VISITATION_SEARCH_FILTER) => void;
  onChangeSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickPeriodModal: () => void;
  onClickSearch: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClickClosePeriodModal: () => void;
  onClickSavePeriod: (startDate: string, endDate: string) => void;
};

const VisitationRowView = ({
  isModalShown,
  statusFilter,
  searchFilter,
  searchValue,
  searchRef,
  filteredItems,
  onClickStatusFilterItem,
  onClickPeriodModal,
  onClickSearchFilterItem,
  onChangeSearchValue,
  onClickSearch,
  onKeyDown,
  onClickClosePeriodModal,
  onClickSavePeriod,
}: VisitationViewProps) => {
  const t_button = useScopedI18n('button');
  const searchFilterDropdownItems = useVisitationSearchFilterDropdownItems();
  const statusFilterDropdownItems = useVisitationStatusFilterDropdownItems();

  const { visitationFilter } = useSelector(
    (state: RootState) => state.visitationFilter
  );

  const { width } = useWindowSize();

  return (
    <VisitationContainer>
      <RowTop>
        <FilterList>
          <ButtonContainer>
            {/* 설정 활성화 버튼 */}
            <Button
              text={t_button('filterVisitationDate')}
              height={30}
              width={60}
              onClick={onClickPeriodModal}
              backgroundColor={WHITE}
              borderColor={GRAY.LIGHT}
              color={GRAY.DARK}
            />
            {/* 설정 모달 */}
            <PeriodModal
              isShown={isModalShown}
              onClickClose={onClickClosePeriodModal}
              startDate={visitationFilter.fromStartDate}
              endDate={visitationFilter.toStartDate}
              onClickSave={onClickSavePeriod}
            />
          </ButtonContainer>
          {/* 필터 설정된 값들 */}
          <FilteredItemList $width={width - 650}>
            {filteredItems.map((item) => (
              <VisitationFilteredItem
                key={`${item.title}-${item.value?.join?.('-') ?? ''}`}
                item={item}
              />
            ))}
          </FilteredItemList>
        </FilterList>
        {/* 검색 부분 */}
        <SearchContainer>
          <StatusDropdown
            value={statusFilter}
            items={statusFilterDropdownItems}
            onChangeItem={onClickStatusFilterItem}
            height={30}
            width={130}
            borderColor={GRAY.SEMI_LIGHT}
            backgroundBlur={false}
          />
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
    </VisitationContainer>
  );
};

export default VisitationRowView;
