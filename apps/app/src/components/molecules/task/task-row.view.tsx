import { ChangeEvent, Ref } from 'react';
import styled from 'styled-components';

import { Button, SvgIcon } from '@mokjang/components';
import { GRAY, MAIN, TASK, TASK_STATUS, WHITE } from '@mokjang/constants';

import {
  useTaskSearchFilterDropdownItems,
  useTaskStatusFilterDropdownItems,
} from '@/hooks/dropdown/dropdown-items';
import useWindowSize from '../../../hooks/window/window';
import { useScopedI18n } from '../../../../locales/client';
import TaskFilteredItem, {
  TaskFilteredItemType,
} from '../../atoms/task/task-filtered-item';
import PeriodModal from '../../atoms/common/modal/period-modal';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import SearchInput from '../../atoms/common/input/search-input';

import { Svg } from '@mokjang/assets';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';

const TaskContainer = styled.div`
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
  padding: 10px 0;
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
              value={statusFilter}
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
    </TaskContainer>
  );
};

export default TaskRowView;
