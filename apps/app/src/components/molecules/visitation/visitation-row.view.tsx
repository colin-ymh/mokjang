import { ChangeEvent, Ref } from 'react';
import styled from 'styled-components';

import { Button, SvgIcon } from '../../../../../../packages/components/src';
import { GRAY, MAIN, WHITE } from '../../../../../../packages/constants/src';
import { TASK_STATUS, VISITATION } from '@mokjang/constants';

import {
  useTaskStatusFilterDropdownItems,
  useVisitationSearchFilterDropdownItems,
} from '@/hooks/dropdown/dropdown-items';
import useWindowSize from '../../../hooks/window/window';
import { useScopedI18n } from '../../../../locales/client';
import VisitationFilteredItem, {
  VisitationFilteredItemType,
} from '../../atoms/visitation/visitation-filtered-item';
import PeriodModal from '../../atoms/common/modal/period-modal';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import SearchInput from '../../atoms/common/input/search-input';

import { Svg } from '@mokjang/assets';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';

const VisitationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  // border-bottom: 1px solid ${GRAY.LIGHT};
  flex-shrink: 0;
  position: relative;
  background-color: ${WHITE};
`;

const RowTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 10px 20px;
`;

const FilterList = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  gap: 10px;
`;

const FilteredItemList = styled.div<{ $width: number }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
  width: ${({ $width }) => $width}px;
  overflow-x: scroll;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

export type VISITATION_SEARCH_FILTER = VISITATION.TITLE | VISITATION.IN_CHARGE;

type VisitationViewProps = {
  isModalShown: boolean;
  searchFilter: VISITATION_SEARCH_FILTER;
  searchValue: string;
  searchRef: Ref<HTMLInputElement>;
  filteredItems: VisitationFilteredItemType[];
  onClickStatusFilterItem: (value: TASK_STATUS) => void;
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
  const statusFilterDropdownItems = useTaskStatusFilterDropdownItems();

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
              width={'auto'}
              onClick={onClickPeriodModal}
              backgroundColor={WHITE}
              borderColor={isModalShown ? MAIN.DEFAULT : GRAY.LIGHT}
              color={GRAY.SEMI_DARK}
              icon={
                <SvgIcon
                  svg={Svg.Calendar}
                  color={GRAY.SEMI_DARK}
                  bottom={0.5}
                />
              }
            />

            <Dropdown
              value={visitationFilter.status[0]}
              items={statusFilterDropdownItems}
              onChangeItem={onClickStatusFilterItem}
              height={30}
              width={100}
              borderColor={GRAY.LIGHT}
              backgroundBlur={false}
              color={GRAY.SEMI_DARK}
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
          <SearchInput
            searchRef={searchRef}
            // searchFilter={searchFilter}
            // searchFilterDropdownItems={searchFilterDropdownItems}
            // onClickSearchFilterItem={onClickSearchFilterItem}
            searchValue={searchValue}
            onChangeSearchValue={onChangeSearchValue}
            onKeyDown={onKeyDown}
            onClickSearch={onClickSearch}
            color={GRAY.SEMI_DARK}
          />
        </SearchContainer>
      </RowTop>
    </VisitationContainer>
  );
};

export default VisitationRowView;
