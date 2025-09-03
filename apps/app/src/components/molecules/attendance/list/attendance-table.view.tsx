import React, { MutableRefObject } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import { BLACK, DESTRUCTIVE, GRAY, GREEN, WHITE } from '@mokjang/constants';
import { MainText } from '@mokjang/components';
import { BLANK } from '@mokjang/constants';
import useWindowSize from '../../../../hooks/window/window';
import {
  WORSHIP_ATTENDANCE_STATUS,
  WorshipEnrollment,
  WorshipSessionCheckStatus,
} from '@mokjang/models';
import { WORSHIP_ENROLLMENT } from '@mokjang/constants';
import AttendanceTableHeader from '../../../atoms/attendance/list/attendance-table-header';
import {
  getDateFromDateString,
  getDateFromInput,
  getDateStringFromDate,
  getIsSameDate,
  getMonthDateFromDate,
  getWorshipSessionDates,
} from '@mokjang/utils';
import { EDUCATION_TABLE_HEADER_ITEM } from '../../../../redux/reducers/filter/worship-enrollment-filter-reducer';

import { Svg } from '@mokjang/assets';
import MemberProfilePopupButton from '../../common/button/member-profile-popup-button';
import AttendanceInformation from '../../../organisms/attendance/information/attendance-information';
import { useScopedI18n } from '../../../../../locales/client';
import { getWorshipAttendanceRateColor } from '../../../../utils/color';
import WrappedPagePopup from '../../../atoms/common/popup/wrapped-page-popup';
import CustomTooltip from '../../../atoms/common/tooltip/custom-tooltip';

// 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)
const getColumnWidth = (id: string) => {
  switch (id) {
    case WORSHIP_ENROLLMENT.NAME:
      return 150;
    case WORSHIP_ENROLLMENT.GROUP_NAME:
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
  height: ${({ height }) => `${height}px`};

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
  padding: 10px;
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: ${WHITE};
  border-right: 1px solid ${GRAY.LIGHT};
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
    background: ${GRAY.LIGHT};
  }

  &:last-child {
    border-right: none;
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

const IconContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const PresentIcon = styled(Svg.Circle)`
  width: 20px;
  height: 20px;
  stroke: ${GREEN.DEFAULT};
  stroke-width: 3px;
`;

const AbsentIcon = styled(Svg.Cancel)`
  width: 20px;
  height: 20px;
  stroke: ${DESTRUCTIVE.DEFAULT};
  stroke-width: 3px;
`;

const ButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
  padding-right: 10px;
`;

const Cancel = styled(Svg.Cancel)`
  width: 30px;
  height: 30px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;

type AttendanceTableProps = {
  isSessionShown: boolean;
  isStatisticOpened: boolean;
  onClickSessionClose: () => void;
  worshipEnrollments: WorshipEnrollment[];
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onClickHeader: (id: WORSHIP_ENROLLMENT | string, isSession: boolean) => void;
  checkStatuses: WorshipSessionCheckStatus[];
};

const AttendanceTableView = ({
  isSessionShown,
  isStatisticOpened,
  onClickSessionClose,
  worshipEnrollments,
  scrollRef,
  onScroll,
  onClickHeader,
  checkStatuses,
}: AttendanceTableProps) => {
  const t_button = useScopedI18n('button');
  const t_title = useScopedI18n('title');

  const { worshipEnrollmentFilter } = useSelector(
    (state: RootState) => state.worshipEnrollmentFilter
  );
  const { targetWorship } = useSelector(
    (state: RootState) => state.targetWorship
  );
  const { targetWorshipSessionWorship, targetWorshipSession } = useSelector(
    (state: RootState) => state.targetWorshipSession
  );
  const { height } = useWindowSize();

  const worshipEnrollmentTableHeaderItemList = useSelector(
    (state: RootState) =>
      state.worshipEnrollmentFilter.worshipEnrollmentTableHeaderItemList
  );

  const sessionDates = getWorshipSessionDates(
    getDateFromInput(worshipEnrollmentFilter.fromSessionDate),
    getDateFromInput(worshipEnrollmentFilter.toSessionDate),
    targetWorship.worshipDay,
    targetWorship.repeatPeriod
  );

  // 실제 표시할 컬럼 ID 배열 + 세션 날짜 행 + 공란
  const visibleColumns: EDUCATION_TABLE_HEADER_ITEM[] = [
    ...worshipEnrollmentTableHeaderItemList,
    ...sessionDates.map((sessionDate, index) => ({
      id: index.toString(),
      title: getMonthDateFromDate(sessionDate),
      date: sessionDate,
      isSortable: false,
      isFilterable: false,
      isSession: true,
    })),
    // 14개까지 빈 컬럼 추가
    ...Array.from(
      { length: Math.max(0, 14 - sessionDates.length) },
      (_, index) => ({
        id: (sessionDates.length + index).toString(),
        title: '',
        isSortable: false,
        isFilterable: false,
        isSession: true,
      })
    ),
  ];

  // 각 TD에 들어갈 content
  const getAttendanceTableContent = (
    id: WORSHIP_ENROLLMENT | string,
    enrollment: WorshipEnrollment,
    date?: Date
  ) => {
    if (date) {
      const attendance = enrollment.worshipAttendances.find((attendance) =>
        getIsSameDate(
          date as Date,
          getDateFromDateString(attendance.sessionDate)
        )
      );
      return (
        <IconContainer>
          {attendance?.attendanceStatus ===
            WORSHIP_ATTENDANCE_STATUS.ABSENT && <AbsentIcon />}
          {attendance?.attendanceStatus ===
            WORSHIP_ATTENDANCE_STATUS.PRESENT && <PresentIcon />}
        </IconContainer>
      );
    } else {
      switch (id) {
        case WORSHIP_ENROLLMENT.NAME:
          return <MemberProfilePopupButton member={enrollment.member} />;
        case WORSHIP_ENROLLMENT.GROUP_NAME:
          return <MainText>{enrollment.member.group?.name}</MainText>;
        case WORSHIP_ENROLLMENT.ATTENDANCE_RATE:
          const percentage = Math.round(enrollment.attendanceRate * 100);

          return (
            <IconContainer>
              <MainText color={getWorshipAttendanceRateColor(percentage)}>
                {`${percentage}%`}
              </MainText>
            </IconContainer>
          );
        case BLANK:
          return <div></div>;
        default:
          return null;
      }
    }
  };

  return (
    <>
      {/* 컨테이너: 항상 가로 100%, 필요하면 스크롤 */}
      <TableContainer
        ref={scrollRef}
        onScroll={onScroll}
        height={isStatisticOpened ? height - 400 : height - 290}
      >
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
                      isCheckDone={
                        item.date &&
                        checkStatuses.find(
                          (checkStatus) =>
                            getDateStringFromDate(item.date as Date) ===
                            getDateStringFromDate(
                              getDateFromDateString(checkStatus.sessionDate)
                            )
                        )?.completeAttendanceCheck
                      }
                    />
                  )}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {worshipEnrollments.map((enrollment) => (
              <AttendanceTableRow key={enrollment.id}>
                {visibleColumns.map((item) => (
                  <TableData
                    key={item.id}
                    id={item.id}
                    $isSession={item.isSession}
                  >
                    <CustomTooltip text={'특이사항'}>
                      <ContentWrapper>
                        {getAttendanceTableContent(
                          item.id,
                          enrollment,
                          item?.date
                        )}
                      </ContentWrapper>
                    </CustomTooltip>
                  </TableData>
                ))}
              </AttendanceTableRow>
            ))}
          </tbody>
        </AttendanceTable>
      </TableContainer>

      {/* 회차 상세정보 팝업*/}
      <WrappedPagePopup
        isShow={isSessionShown}
        onClickClose={onClickSessionClose}
        headerTitle={`${targetWorshipSessionWorship.title} ${t_title('attendanceInformation')} (${getDateStringFromDate(getDateFromDateString(targetWorshipSession.sessionDate))})`}
        rightButtonShown={false}
        stageTwoTop={40}
      >
        {(scrollRef) => <AttendanceInformation scrollRef={scrollRef} />}
      </WrappedPagePopup>
    </>
  );
};

export default AttendanceTableView;
