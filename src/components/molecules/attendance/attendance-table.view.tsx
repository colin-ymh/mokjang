import React, { MutableRefObject } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BLANK } from '@/constants/constant';
import useWindowSize from '@/hooks/window/window';
import MemberProfile from '@/components/atoms/member/member-profile';
import { WorshipEnrollment } from '@/models/worship/worship';
import { WORSHIP_ENROLLMENT } from '@/constants/worship/worship-column';
import AttendanceTableHeader from '@/components/atoms/attendance/attendance-table-header';

// 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)
const getColumnWidth = (id: string) => {
  switch (id) {
    case WORSHIP_ENROLLMENT.NAME:
      return 100;
    case WORSHIP_ENROLLMENT.GROUP:
      return 100;
    case WORSHIP_ENROLLMENT.ATTENDANCE_RATE:
      return 50;
    default:
      return 10;
  }
};

// 2. 테이블 컨테이너 (100% 폭 + 스크롤)
const TableContainer = styled.div<{ height: number }>`
  /* 항상 가로 100%를 채움 */
  width: 100%;
  /* 세로 높이만큼 상하 스크롤 */
  height: ${({ height }) => `${height - 230}px`};

  /* 오버플로 시 스크롤 */
  overflow-x: hidden;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
`;

// 3. 테이블은 width: 100% + table-layout: fixed
const AttendanceTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
  white-space: normal;
`;

// 4. 헤더(TH)
const TableHeader = styled.th<{ id: string; $isSession?: boolean }>`
  padding: 3px 10px;
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: ${WHITE};

  /* 만약 마지막 컬럼이면 width: auto */
  width: ${({ id, $isSession }) =>
    $isSession ? 'auto' : `${getColumnWidth(id)}px`};
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
    background: ${GRAY.SEMI_LIGHT};
  }
`;

// 5. 본문(TR/TD)
const AttendanceTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
`;

const TableData = styled.td<{ id: string; $isSession: boolean }>`
  padding: 10px;

  width: ${({ id, $isSession }) =>
    $isSession ? 'auto' : `${getColumnWidth(id)}px`};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-left: 1px solid ${GRAY.LIGHT};

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

type AttendanceTableProps = {
  worshipEnrollments: WorshipEnrollment[];
  onClickHeader: (id: WORSHIP_ENROLLMENT) => void;
  onClickWorshipEnrollment: (id: string) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const AttendanceTableView = ({
  worshipEnrollments,
  onClickHeader,
  onClickWorshipEnrollment,
  scrollRef,
  onScroll,
}: AttendanceTableProps) => {
  const { height } = useWindowSize();

  const worshipEnrollmentTableHeaderItemList = useSelector(
    (state: RootState) =>
      state.worshipEnrollmentFilter.worshipEnrollmentTableHeaderItemList
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...worshipEnrollmentTableHeaderItemList,
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => {
      return {
        id: index.toString(),
        isSortable: false,
        isFilterable: false,
        isSession: true,
      };
    }),
  ];

  // 각 TD에 들어갈 content
  const getAttendanceTableContent = (
    id: string,
    enrollment: WorshipEnrollment
  ) => {
    switch (id) {
      case WORSHIP_ENROLLMENT.NAME:
        return <MemberProfile member={enrollment.member} />;
      case WORSHIP_ENROLLMENT.GROUP:
        return <MainText>{enrollment.member.group?.name}</MainText>;
      case WORSHIP_ENROLLMENT.ATTENDANCE_RATE:
        return <MainText></MainText>;
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
        <AttendanceTable>
          <thead>
            <tr>
              {visibleColumns.map((item) => (
                <TableHeader
                  key={item.id}
                  id={item.id}
                  $isSession={item.isSession}
                >
                  {item.id !== BLANK && (
                    <AttendanceTableHeader
                      item={{
                        ...item,
                        id: item.id as WORSHIP_ENROLLMENT,
                      }}
                      onClick={onClickHeader}
                    />
                  )}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {worshipEnrollments.map((enrollment) => (
              <AttendanceTableRow
                key={enrollment.id}
                onClick={() => {
                  onClickWorshipEnrollment(enrollment.id);
                }}
              >
                {visibleColumns.map((item) => (
                  <TableData
                    key={item.id}
                    id={item.id}
                    $isSession={item.isSession}
                  >
                    <ContentWrapper>
                      {getAttendanceTableContent(item.id, enrollment)}
                    </ContentWrapper>
                  </TableData>
                ))}
              </AttendanceTableRow>
            ))}
          </tbody>
        </AttendanceTable>
      </TableContainer>
    </>
  );
};

export default AttendanceTableView;
