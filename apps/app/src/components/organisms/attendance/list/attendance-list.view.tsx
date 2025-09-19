import styled from 'styled-components';
import React from 'react';
import { MEDIA_MIN_WIDTH } from '@mokjang/constants';
import AttendanceTable, {
  AttendanceTableProps,
} from '../../../molecules/attendance/list/attendance-table';
import AttendanceRow from '../../../molecules/attendance/list/attendance-row';
import { GRAY, WHITE } from '@mokjang/constants';

const AttendanceListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  background-color: ${WHITE};
  padding: 20px;
`;

const MobileView = styled.div`
  display: flex;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
`;

const DesktopView = styled.div`
  display: none;
  justify-content: flex-start;
  overflow: hidden;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

const TableContainer = styled.div`
  display: flex;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  overflow: hidden;
`;

type AttendanceListViewProps = {
  list: AttendanceTableProps;
  information: {};
};

const AttendanceListView = (props: AttendanceListViewProps) => {
  return (
    <AttendanceListContainer>
      {/* 모바일에서 보일 목록형 UI */}
      {/*<MobileView>*/}
      {/*  <AttendanceItemList {...props.list} />*/}
      {/*</MobileView>*/}
      {/* 데스크탑에서 보일 테이블형 UI */}
      <DesktopView>
        <AttendanceRow {...props.list} />
        <TableContainer>
          <AttendanceTable {...props.list} />
        </TableContainer>
      </DesktopView>
    </AttendanceListContainer>
  );
};

export default AttendanceListView;
