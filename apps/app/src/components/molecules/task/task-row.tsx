import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../../../redux/store';
import { setTaskFilter } from '../../../redux/reducers/filter/task-filter-reducer';
import { getTrimmedString } from '../../../utils/format';
import { TASK } from '../../../constants/column/task-column';
import { BLANK } from '../../../constants/constant';
import TaskRowView, { TASK_SEARCH_FILTER } from './task-row.view';
import { TaskFilteredItemType } from '../../atoms/task/task-filtered-item';

import { TASK_STATUS } from '../../../constants/status/status';

const TaskRow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { taskFilter } = useSelector((state: RootState) => state.taskFilter);
  // 기간 설정  모달 on off
  const [isModalShown, setIsAddFilterShown] = useState<boolean>(false);

  // 목록 설정 모달 열기
  const onClickPeriodModal = () => {
    setIsAddFilterShown(!isModalShown);
  };

  // 목록 설정 닫기
  const onClickClosePeriodModal = () => {
    setIsAddFilterShown(false);
  };

  // 기간 저장
  const onClickSavePeriod = (startDate: string, endDate: string) => {
    dispatch(
      setTaskFilter({
        ...taskFilter,
        [TASK.FROM_DATE]: startDate,
        [TASK.TO_DATE]: endDate,
      })
    );
    setIsAddFilterShown(false);
  };

  // 상태 필터
  const [statusFilter, setStatusFilter] = useState<TASK_STATUS | undefined>(
    undefined
  );

  // 상태 선택
  const onClickStatusFilterItem = (value: TASK_STATUS) => {
    setStatusFilter(value);
    if (value) {
      dispatch(
        setTaskFilter({
          ...taskFilter,
          [TASK.STATUS]: [value],
        })
      );
    } else {
      dispatch(
        setTaskFilter({
          ...taskFilter,
          [TASK.STATUS]: [],
        })
      );
    }
  };

  // 검색 필터 주제
  const [searchFilter, setSearchFilter] = useState<TASK_SEARCH_FILTER>(
    TASK.TITLE
  );
  // 검색 내용 ref
  const searchRef = useRef<HTMLInputElement>(null);
  // 검색 필터 내용
  const [searchValue, setSearchValue] = useState<string>(BLANK);
  // 필터 내용 태그
  const [filteredItems, setFilteredItems] = useState<TaskFilteredItemType[]>(
    []
  );

  // 검색 주제 선택
  const onClickSearchFilterItem = (value: TASK_SEARCH_FILTER) => {
    setSearchFilter(value);
  };

  // 검색 내용 변경
  const onChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = getTrimmedString(event.target.value);
    setSearchValue(newValue);
  };

  // 검색 버튼
  const onClickSearch = () => {
    dispatch(setTaskFilter({ ...taskFilter, [searchFilter]: searchValue }));
  };

  // 검색 중 엔터
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchRef.current === document.activeElement) {
      onClickSearch();
    }
  };

  // 필터된 내용들을 태그 형식으로 변환
  useEffect(() => {
    let newFilterItems: TaskFilteredItemType[] = [];

    // 상태
    if (taskFilter.status.length > 0) {
      newFilterItems.push({
        title: TASK.STATUS,
        value: taskFilter.status,
      });
    } else {
      setStatusFilter(undefined);
    }

    // 등록일
    if (taskFilter.fromStartDate || taskFilter.toStartDate) {
      newFilterItems.push({
        title: TASK.DATE,
        value: [taskFilter.fromStartDate, taskFilter.toStartDate],
      });
    }

    // 이름
    if (taskFilter.title) {
      newFilterItems.push({
        title: TASK.TITLE,
        value: [taskFilter.title],
      });
    }

    // 이름
    if (taskFilter.inCharge.id) {
      newFilterItems.push({
        title: TASK.IN_CHARGE,
        value: [taskFilter.inCharge.name],
      });
    }

    setFilteredItems(newFilterItems);
  }, [taskFilter]);

  const props = {
    isModalShown,
    searchFilter,
    searchValue,
    searchRef,
    statusFilter,
    filteredItems,
    onClickStatusFilterItem,
    onClickPeriodModal,
    onClickSearchFilterItem,
    onChangeSearchValue,
    onClickSearch,
    onKeyDown,
    onClickClosePeriodModal,
    onClickSavePeriod,
  };

  return (
    <>
      <TaskRowView {...props} />
    </>
  );
};

export default TaskRow;
