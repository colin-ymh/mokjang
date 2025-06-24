import styled from 'styled-components';
import React from 'react';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import AttendanceTable, {
  AttendanceTableProps,
} from '@/components/molecules/attendance/list/attendance-table';
import AttendanceRow from '@/components/molecules/attendance/list/attendance-row';

const AttendanceListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
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
  width: 100%;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: column;
  }
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
        <AttendanceRow />
        <AttendanceTable {...props.list} />
      </DesktopView>
    </AttendanceListContainer>
  );
};

export default AttendanceListView;
