import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  setTaskOrderBy,
  setTaskOrderDirection,
} from '@/redux/reducers/filter/task-filter-reducer';

import TaskTableView from '@/components/molecules/task/task-table.view';
import { TASK } from '@/constants/task/task-column';
import { ORDER_DIRECTION } from '@/constants/constant';

export type TaskTableProps = {
  onClickTaskItem: (taskId: string) => void;
  loadTasks: () => Promise<void>;
};

const TaskTable = ({ onClickTaskItem, loadTasks }: TaskTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { tasks, taskFilter, taskOrderBy, taskOrderDirection } = useSelector(
    (state: RootState) => state.taskFilter
  );

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: TASK) => {
    let newOrderBy = id;

    if (newOrderBy !== taskOrderBy) {
      dispatch(setTaskOrderBy(newOrderBy));
      dispatch(setTaskOrderDirection(ORDER_DIRECTION.ASC));
    } else {
      dispatch(
        setTaskOrderDirection(
          taskOrderDirection === ORDER_DIRECTION.ASC
            ? ORDER_DIRECTION.DESC
            : ORDER_DIRECTION.ASC
        )
      );
    }
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      // 스크롤이 최하단에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight) {
        loadTasks(); // 데이터를 추가로 로드
      }
    }
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [taskOrderBy, taskOrderDirection, taskFilter]);

  const props = {
    tasks,
    onClickHeader,
    onClickTaskItem,
    scrollRef,
    onScroll,
  };

  return (
    <>
      <TaskTableView {...props} />
    </>
  );
};

export default TaskTable;
