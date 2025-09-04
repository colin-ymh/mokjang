import React from 'react';
import styled from 'styled-components';

import { GRAY, MEDIA_MIN_WIDTH, SIZE } from '@mokjang/constants';
import { Button, MainText } from '@mokjang/components';

import { useScopedI18n } from '../../../../../../../locales/client';
import { MAIN_HEADER_ID } from '@/constants/layout/header';
import AttendanceInformation from '../../../../../organisms/attendance/information/attendance-information';
import WrappedPagePopup from '../../../../../atoms/common/popup/wrapped-page-popup';
import { getDateFromDateString, getDateStringFromDate } from '@mokjang/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    height: 40px;
    padding: 0 20px;
    justify-content: center;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    height: 120px;
    justify-content: space-between;
    padding: 0;
    border-bottom: 0.7px solid ${GRAY.LIGHT};
  }
`;

const HeaderTopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0 20px;
`;

const HeaderBottomContainer = styled.div`
  display: none;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
`;

type MainAttendanceHeaderViewProps = {
  isSessionShown: boolean;
  onClickSessionClose: () => void;
  onClickSessionOpen: () => void;
};

const MainAttendanceHeaderView = ({
  isSessionShown,
  onClickSessionClose,
  onClickSessionOpen,
}: MainAttendanceHeaderViewProps) => {
  const t_header = useScopedI18n('header');
  const t_button = useScopedI18n('button');
  const t_title = useScopedI18n('title');

  const { targetWorshipSessionWorship, targetWorshipSession } = useSelector(
    (state: RootState) => state.targetWorshipSession
  );

  return (
    <>
      <HeaderContainer>
        <HeaderTopContainer>
          <MainText size={SIZE.EXTRA_LARGE} fontSize={24}>
            {t_header(MAIN_HEADER_ID.ATTENDANCE)}
          </MainText>
          <Button
            text={t_button('addWorshipSession')}
            onClick={onClickSessionOpen}
            width={150}
            height={30}
          />
        </HeaderTopContainer>
        <HeaderBottomContainer></HeaderBottomContainer>
      </HeaderContainer>

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

export default MainAttendanceHeaderView;
