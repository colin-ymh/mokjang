import { ChangeEvent, Ref } from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/common/button/button';
import { BLACK, GRAY, WHITE } from '@/constants/styles/color';
import { TASK } from '@/constants/column/task-column';

import {
  useTaskSearchFilterDropdownItems,
  useTaskStatusFilterDropdownItems,
} from '@/hooks/dropdown/dropdown-items';
import useWindowSize from '@/hooks/window/window';
import { useScopedI18n } from '../../../../locales/client';
import TaskFilteredItem, {
  TaskFilteredItemType,
} from '@/components/atoms/task/task-filtered-item';
import PeriodModal from '@/components/atoms/common/modal/period-modal';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import SearchInput from '@/components/atoms/common/input/search-input';
import { TASK_STATUS } from '@/constants/status/status';

import Calendar from '../../../../public/svg/calendar.svg';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';

const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid ${GRAY.LIGHT};
  flex-shrink: 0;
  position: relative;
  background-color: ${WHITE};
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
  gap: 10px;
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

export type TASK_SEARCH_FILTER = TASK.TITLE | TASK.IN_CHARGE;

type TaskViewProps = {
  isModalShown: boolean;
  statusFilter: TASK_STATUS | undefined;
  searchFilter: TASK_SEARCH_FILTER;
  searchValue: string;
  searchRef: Ref<HTMLInputElement>;
  filteredItems: TaskFilteredItemType[];
  onClickStatusFilterItem: (value: TASK_STATUS) => void;
  onClickSearchFilterItem: (value: TASK_SEARCH_FILTER) => void;
  onChangeSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickPeriodModal: () => void;
  onClickSearch: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClickClosePeriodModal: () => void;
  onClickSavePeriod: (startDate: string, endDate: string) => void;
};

const TaskRowView = ({
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
}: TaskViewProps) => {
  const t_button = useScopedI18n('button');
  const searchFilterDropdownItems = useTaskSearchFilterDropdownItems();
  const statusFilterDropdownItems = useTaskStatusFilterDropdownItems();

  const { taskFilter } = useSelector((state: RootState) => state.taskFilter);

  const { width } = useWindowSize();

  return (
    <TaskContainer>
      <RowTop>
        <FilterList>
          <ButtonContainer>
            {/* 설정 활성화 버튼 */}
            <Button
              text={t_button('filterTaskDate')}
              height={30}
              width={'auto'}
              onClick={onClickPeriodModal}
              backgroundColor={WHITE}
              borderColor={GRAY.LIGHT}
              color={BLACK}
              icon={<SvgIcon svg={Calendar} />}
            />

            <StatusDropdown
              value={statusFilter}
              items={statusFilterDropdownItems}
              onChangeItem={onClickStatusFilterItem}
              height={30}
              width={130}
              borderColor={GRAY.LIGHT}
              backgroundBlur={false}
            />
            {/* 설정 모달 */}
            <PeriodModal
              isShown={isModalShown}
              onClickClose={onClickClosePeriodModal}
              startDate={taskFilter.fromStartDate}
              endDate={taskFilter.toStartDate}
              onClickSave={onClickSavePeriod}
            />
          </ButtonContainer>
          {/* 필터 설정된 값들 */}
          <FilteredItemList $width={width - 650}>
            {filteredItems.map((item) => (
              <TaskFilteredItem
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
    </TaskContainer>
  );
};

export default TaskRowView;
