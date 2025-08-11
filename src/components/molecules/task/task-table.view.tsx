import React, { MutableRefObject } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, WHITE } from '@/constants/styles/color';
import { TASK } from '@/constants/column/task-column';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BLANK } from '@/constants/constant';
import { Task } from '@/models/task/task';
import useWindowSize from '@/hooks/window/window';
import TaskTableHeader from '@/components/atoms/task/task-table-header';
import { BLANK_HEADER } from '@/redux/reducers/filter/member-filter-reducer';
import { useI18n } from '../../../../locales/client';
import { getStatusBackgroundColor, getStatusFontColor } from '@/utils/color';
import MemberProfile from '@/components/atoms/member/member-profile';
import MainTag from '@/components/atoms/common/tag/main-tag';
import { STATUS } from '@/constants/status/status';
import { getFormattedDate } from '@/utils/format';

// 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)
const getColumnWidth = (id: string) => {
  switch (id) {
    case TASK.TITLE:
      return 25;
    case TASK.STATUS:
      return 25;
    case TASK.DATE:
      return 25;
    case TASK.IN_CHARGE:
      return 25;
    default:
      // 비고(REMARKS) 컬럼 등
      return 80;
  }
};

// 2. 테이블 컨테이너 (100% 폭 + 스크롤)
const TableContainer = styled.div<{ height: number }>`
  /* 항상 가로 100%를 채움 */
  width: 100%;
  /* 세로 높이만큼 상하 스크롤 */
  height: ${({ height }) => `${height - 260}px`};

  /* 오버플로 시 스크롤 */
  overflow-x: auto;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
`;

// 3. 테이블은 width: 100% + table-layout: fixed
const TaskTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
  /* 아래 옵션으로 텍스트 줄바꿈 등 처리. 
         white-space: nowrap; 로 하면 줄바꿈 없이 가로로 늘어나게 됨 */
  white-space: normal;
`;

// 4. 헤더(TH)
const TableHeader = styled.th<{ id: string; $isLast?: boolean }>`
  padding: 20px 10px;
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: ${WHITE};

  /* 만약 마지막 컬럼이면 width: auto */
  width: ${({ id, $isLast }) => ($isLast ? 'auto' : `${getColumnWidth(id)}%`)};
  /* 텍스트 넘침 처리 */
  overflow: hidden;
  text-overflow: ellipsis;

  /* pseudo‐element 로 보더를 직접 그려서 절대 안 사라지게 */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 0.7px;
    background: ${GRAY.LIGHT};
  }
`;

// 5. 본문(TR/TD)
const TaskTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  &:hover td {
    background-color: ${GRAY.LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $index: number; $isLast?: boolean }>`
  padding: 10px;

  cursor: pointer;

  /* 마지막 컬럼이면 auto, 아니면 px 고정 */
  width: ${({ id, $isLast }) => ($isLast ? 'auto' : `${getColumnWidth(id)}%`)};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:first-child {
    border-left: none;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  /* 그냥 늘어날 수 있게, 필요한 경우 ellipsis 처리 */
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type TaskTableProps = {
  tasks: Task[];
  onClickHeader: (id: TASK) => void;
  onClickTaskItem: (taskId: string) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const TaskTableView = ({
  tasks,
  onClickHeader,
  onClickTaskItem,
  scrollRef,
  onScroll,
}: TaskTableProps) => {
  const t = useI18n();
  const { height } = useWindowSize();

  const taskTableHeaderItemList = useSelector(
    (state: RootState) => state.taskFilter.taskTableHeaderItemList
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...taskTableHeaderItemList.filter((item) => item.isShown),
    BLANK_HEADER,
  ];

  // 각 TD에 들어갈 content
  const getTaskTableContent = (id: string, task: Task) => {
    switch (id) {
      case TASK.TITLE:
        return <MainText>{task?.title}</MainText>;
      case TASK.STATUS:
        return (
          <MainTag
            title={t(task.status as STATUS)}
            color={getStatusFontColor(task.status as STATUS)}
            backgroundColor={getStatusBackgroundColor(task.status as STATUS)}
          />
        );
      case TASK.DATE:
        return (
          <MainText>
            {`${
              task.startDate && getFormattedDate(task.startDate)
            } - ${task.endDate && getFormattedDate(task.endDate)}`}
          </MainText>
        );
      case TASK.IN_CHARGE:
        return <MemberProfile member={task.inCharge} />;
      case BLANK:
        return <div></div>;
      default:
        return null;
    }
  };

  return (
    <>
      {/* 컨테이너: 항상 가로 100%, 필요하면 스크롤 */}
      <TableContainer ref={scrollRef} onScroll={onScroll} height={height}>
        <TaskTable>
          <thead>
            <tr>
              {visibleColumns.map((item, index) => (
                <TableHeader
                  key={item.id}
                  id={item.id}
                  $isLast={index === visibleColumns.length - 1}
                >
                  {item.id !== BLANK && (
                    <TaskTableHeader
                      item={{
                        ...item,
                        id: item.id as TASK,
                      }}
                      onClick={onClickHeader}
                    />
                  )}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, rowIndex) => (
              <TaskTableRow
                key={task.id}
                onClick={() => {
                  onClickTaskItem(task.id);
                }}
              >
                {visibleColumns.map((item, index) => (
                  <TableData
                    key={item.id}
                    id={item.id}
                    $index={rowIndex}
                    $isLast={index === visibleColumns.length - 1}
                  >
                    <ContentWrapper>
                      {getTaskTableContent(item.id, task)}
                    </ContentWrapper>
                  </TableData>
                ))}
              </TaskTableRow>
            ))}
          </tbody>
        </TaskTable>
      </TableContainer>
    </>
  );
};

export default TaskTableView;
