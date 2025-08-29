import React, { MutableRefObject } from 'react';
import styled from 'styled-components';

import { GRAY, GREEN, RED } from '../../../../../constants/styles/color';
import { MainText } from '../../../../atoms/common/text/main-text';
import { BLANK } from '../../../../../constants/constant';
import useWindowSize from '../../../../../hooks/window/window';
import {
  WORSHIP_ATTENDANCE_STATUS,
  WorshipAttendance,
} from '../../../../../models/worship/worship';
import SvgIcon from '../../../../atoms/common/icon/svg-icon';

import Check from '../../../../../../public/svg/check.svg';
import Cancel from '../../../../../../public/svg/cancel.svg';
import { getTranslatedDateFromDateString } from '../../../../../utils/translate';
import {
  getDateFromDateString,
  getDateStringFromDate,
} from '../../../../../utils/date';
import { usePathname } from 'next/navigation';
import { LOCALE } from '../../../../../constants/state/locale';
import { SIZE } from '../../../../../constants/styles/style';
import { useScopedI18n } from '../../../../../../locales/client';

// 2. 테이블 컨테이너 (100% 폭 + 스크롤)
const TableContainer = styled.div<{ height: number }>`
  /* 항상 가로 100%를 채움 */
  width: 100%;
  /* 세로 높이만큼 상하 스크롤 */
  height: ${({ height }) => `${height - 550}px`};

  /* 오버플로 시 스크롤 */
  overflow-x: auto;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
`;

// 3. 테이블은 width: 100% + table-layout: fixed
const MemberAttendanceTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
  /* 아래 옵션으로 텍스트 줄바꿈 등 처리. 
         white-space: nowrap; 로 하면 줄바꿈 없이 가로로 늘어나게 됨 */
  white-space: normal;
`;

// 4. 헤더(TH)
const TableHeader = styled.th`
  padding: 10px;
  background-color: ${GRAY.SUPER_LIGHT};
  position: sticky;
  top: 0;
  z-index: 5;
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

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
`;

// 5. 본문(TR/TD)
const MemberAttendanceTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.LIGHT};
  &:last-child {
    border-bottom: none;
  }
`;

const TableData = styled.td<{ id: string }>`
  padding: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;

  &:first-child {
    border-left: none;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AttendanceItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 10px;
  padding: 5px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const IconContainer = styled.div<{ $backgroundColor: string }>`
  display: flex;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
`;

type MemberAttendanceTableProps = {
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: React.UIEventHandler<HTMLDivElement>;
  attendances: WorshipAttendance[];
};

const MemberAttendanceTableView = ({
  scrollRef,
  onScroll,
  attendances,
}: MemberAttendanceTableProps) => {
  const t_tableHeader = useScopedI18n('tableHeader');
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  const { height } = useWindowSize();

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const columns = [
    {
      id: BLANK,
      isShown: false,
      isSortable: false,
      isFilterable: false,
      isFixed: false,
      isDate: false,
    },
  ];

  // 각 TD에 들어갈 content
  const getMemberAttendanceTableContent = (
    id: string,
    attendance: WorshipAttendance
  ) => {
    switch (id) {
      case BLANK:
        const isPresent =
          attendance.attendanceStatus === WORSHIP_ATTENDANCE_STATUS.PRESENT;
        return (
          <AttendanceItem>
            <IconContainer
              $backgroundColor={isPresent ? GREEN.LIGHT : RED.LIGHT}
            >
              <SvgIcon
                svg={isPresent ? Check : Cancel}
                color={isPresent ? GREEN.DEFAULT : RED.DEFAULT}
                width={2}
              />
            </IconContainer>

            <ColumnContainer>
              <RowContainer>
                <MainText>{attendance.worshipSession.title}</MainText>
                <MainText size={SIZE.SMALL} color={GRAY.SEMI_DARK}>
                  {getTranslatedDateFromDateString(
                    basePath,
                    getDateStringFromDate(
                      getDateFromDateString(attendance.sessionDate)
                    )
                  )}
                </MainText>
              </RowContainer>
              <MainText size={SIZE.SMALL} color={GRAY.SEMI_DARK}>
                {attendance.note}
              </MainText>
            </ColumnContainer>
          </AttendanceItem>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 컨테이너: 항상 가로 100%, 필요하면 스크롤 */}
      <TableContainer ref={scrollRef} onScroll={onScroll} height={height}>
        <MemberAttendanceTable>
          <thead>
            <tr>
              {columns.map((item, index) => (
                <TableHeader key={item.id}>
                  <HeaderContainer>
                    <MainText size={SIZE.SMALL} color={GRAY.DARK}>
                      {t_tableHeader('memberAttendance')}
                    </MainText>
                  </HeaderContainer>
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendances.map((attendance) => (
              <MemberAttendanceTableRow key={attendance.id}>
                {columns.map((item) => (
                  <TableData key={item.id} id={item.id}>
                    <ContentWrapper>
                      {getMemberAttendanceTableContent(item.id, attendance)}
                    </ContentWrapper>
                  </TableData>
                ))}
              </MemberAttendanceTableRow>
            ))}
          </tbody>
        </MemberAttendanceTable>
      </TableContainer>
    </>
  );
};

export default MemberAttendanceTableView;
