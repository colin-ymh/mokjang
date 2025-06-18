import styled from 'styled-components';

import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import Loading from '@/components/atoms/common/etc/loading';
import React from 'react';
import { useScopedI18n } from '../../../../../locales/client';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import AttendanceTable, {
  AttendanceTableProps,
} from '@/components/molecules/attendance/attendance-table';
import AttendanceRow from '@/components/molecules/attendance/attendance-row';
import AttendanceInformation from '@/components/organisms/attendance/information/attendance-information';

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
  information: {
    isAttendanceInformationShown: boolean;
    isLoading: boolean;
    onClickClose: () => void;
  };
};

const AttendanceListView = (props: AttendanceListViewProps) => {
  const t_button = useScopedI18n('button');
  const t_title = useScopedI18n('title');
  const { isAttendanceInformationShown, isLoading, onClickClose } =
    props.information;

  const { targetWorshipSession } = useSelector(
    (state: RootState) => state.targetWorshipSession
  );

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

      {/* 회차 상세정보 팝업*/}
      <SlidePopup
        isShow={isAttendanceInformationShown}
        onClickClose={onClickClose}
        isFooterShown={false}
        headerTitle={targetWorshipSession?.title}
      >
        <AttendanceInformation />
      </SlidePopup>

      <Loading isShow={isLoading} />
    </AttendanceListContainer>
  );
};

export default AttendanceListView;
