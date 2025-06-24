import React, { ChangeEvent, MutableRefObject } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, WHITE } from '@/constants/styles/color';
import { BLANK } from '@/constants/constant';
import useWindowSize from '@/hooks/window/window';
import MemberProfile from '@/components/atoms/member/member-profile';
import {
  WORSHIP_ATTENDANCE_STATUS,
  WorshipAttendance,
} from '@/models/worship/worship';
import { WORSHIP_ATTENDANCE } from '@/constants/worship/worship-column';
import AttendanceInformationTableHeader from '@/components/atoms/attendance/information/attendance-information-table-header';
import BorderTextarea from '@/components/atoms/common/input/border-textarea';
import CheckButton from '@/components/atoms/common/button/check-button';

// 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)
const getColumnWidth = (id: string) => {
  switch (id) {
    case WORSHIP_ATTENDANCE.NAME:
      return 150;
    case WORSHIP_ATTENDANCE.PRESENT:
      return 50;
    case WORSHIP_ATTENDANCE.ABSENT:
      return 50;
    case WORSHIP_ATTENDANCE.NOTE:
      return 200;
    default:
      return 10;
  }
};

// 2. 테이블 컨테이너 (100% 폭 + 스크롤)
const TableContainer = styled.div<{ height: number }>`
  /* 항상 가로 100%를 채움 */
  width: 100%;
  /* 세로 높이만큼 상하 스크롤 */
  height: ${({ height }) => `${height - 100}px`};

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
const TableHeader = styled.th<{ id: string; $isLast?: boolean }>`
  padding: 3px 10px;
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: ${WHITE};
  /* 만약 마지막 컬럼이면 width: auto */
  width: ${({ id, $isLast }) => ($isLast ? 'auto' : `${getColumnWidth(id)}px`)};
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

const TableData = styled.td<{ id: string }>`
  padding: 10px;

  width: ${({ id }) => `${getColumnWidth(id)}px`};

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
  worshipAttendances: WorshipAttendance[];
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onChangePresent: (value: boolean, attendanceId: string) => void;
  onChangeAbsent: (value: boolean, attendanceId: string) => void;
  onChangeNote: (
    event: ChangeEvent<HTMLTextAreaElement>,
    attendanceId: string
  ) => void;
};

const AttendanceInformationTableView = ({
  worshipAttendances,
  scrollRef,
  onScroll,
  onChangePresent,
  onChangeAbsent,
  onChangeNote,
}: AttendanceTableProps) => {
  const { height } = useWindowSize();

  const worshipAttendanceTableHeaderItemList = useSelector(
    (state: RootState) =>
      state.worshipAttendanceFilter.worshipAttendanceTableHeaderItemList
  );

  // 각 TD에 들어갈 content
  const getAttendanceTableContent = (
    id: WORSHIP_ATTENDANCE | string,
    attendance: WorshipAttendance
  ) => {
    switch (id) {
      case WORSHIP_ATTENDANCE.NAME:
        return <MemberProfile member={attendance.worshipEnrollment.member} />;
      case WORSHIP_ATTENDANCE.PRESENT:
        return (
          <CheckButton
            value={
              attendance.attendanceStatus === WORSHIP_ATTENDANCE_STATUS.PRESENT
            }
            onChange={(value) => onChangePresent(value, attendance.id)}
          />
        );
      case WORSHIP_ATTENDANCE.ABSENT:
        return (
          <CheckButton
            value={
              attendance.attendanceStatus === WORSHIP_ATTENDANCE_STATUS.ABSENT
            }
            onChange={(value) => onChangeAbsent(value, attendance.id)}
          />
        );
      case WORSHIP_ATTENDANCE.NOTE:
        return (
          <BorderTextarea
            value={attendance.note}
            borderColor={GRAY.LIGHT}
            onChange={(event) => onChangeNote(event, attendance.id)}
          />
        );
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
              {worshipAttendanceTableHeaderItemList.map((item, index) => (
                <TableHeader
                  key={item.id}
                  id={item.id}
                  $isLast={
                    index === worshipAttendanceTableHeaderItemList.length - 1
                  }
                >
                  <AttendanceInformationTableHeader
                    item={{
                      ...item,
                      id: item.id,
                    }}
                  />
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {worshipAttendances.map((enrollment) => (
              <AttendanceTableRow key={enrollment.id}>
                {worshipAttendanceTableHeaderItemList.map((item) => (
                  <TableData key={item.id} id={item.id}>
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

export default AttendanceInformationTableView;
