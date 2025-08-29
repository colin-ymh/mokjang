import CustomCalendar from '../../../vendor/calendar/custom-calendar';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Schedule } from '../../../models/calendar/calendar';
import CancelIcon from '../../../../public/svg/cancel.svg';
import { BLACK } from '../../../constants/styles/color';
import SlidePopup from '../../atoms/common/popup/slide-popup';
import { DOMAIN } from '../../../models/permission/permission';
import TaskInformation from '../task/information/task-information';
import React from 'react';
import VisitationInformation from '../visitation/information/visitation-information';
import { useI18n } from '../../../../locales/client';
import MemberInformation from '../member/information/member-information';
import ChurchEventInformation from '../church-event/information/church-event-information';
import CustomPopup from '../../atoms/common/popup/custom-popup';
import { TASK_STATUS } from '../../../constants/status/status';
import WrappedPagePopup from '../../atoms/common/popup/wrapped-page-popup';
import { getTranslatedTerm } from '../../../utils/translate';
import EducationSessionInformation from '../education/education-session/information/education-session-information';
import { usePathname } from 'next/navigation';
import { LOCALE } from '../../../constants/state/locale';

const CalendarContainer = styled.div`
  display: flex;
  height: 100%;
  overflow-y: auto;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const Cancel = styled(CancelIcon)`
  width: 30px;
  height: 30px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;

type MainCalendarViewProps = {
  date: Date;
  openedDomain: DOMAIN | null;
  onClickClose: () => void;
  onChangeDate: (date: Date) => void;
  onSelectSchedule: (event: Schedule) => void;
  onChangeTaskStatus: (status: TASK_STATUS) => void;
  onChangeVisitationStatus: (status: TASK_STATUS) => void;
  onChangeEducationSessionStatus: (status: TASK_STATUS) => void;
};

const MainCalendarView = ({
  date,
  openedDomain,
  onClickClose,
  onChangeDate,
  onSelectSchedule,
  onChangeTaskStatus,
  onChangeVisitationStatus,
  onChangeEducationSessionStatus,
}: MainCalendarViewProps) => {
  const { calendarSchedules } = useSelector(
    (state: RootState) => state.calendarFilter
  );
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  const { targetTask } = useSelector((state: RootState) => state.targetTask);
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );

  return (
    <CalendarContainer>
      {/* 달력 */}
      <CustomCalendar
        date={date}
        onChangeDate={onChangeDate}
        schedules={calendarSchedules}
        onSelectSchedule={onSelectSchedule}
      />

      {/* 업무 상세정보 팝업*/}
      <WrappedPagePopup
        isShow={openedDomain === DOMAIN.TASK}
        onClickClose={onClickClose}
        headerTitle={targetTask?.title}
        hideCancel={true}
        hideDone={true}
        widthPercentage={50}
        stageThreeTop={190}
        stageTwoTop={40}
        inCharge={targetTask?.inCharge}
        startDate={targetTask?.startDate}
        endDate={targetTask?.endDate}
        status={targetTask.status}
        onChangeStatus={onChangeTaskStatus}
      >
        <TaskInformation onChangeStatus={onChangeTaskStatus} />
      </WrappedPagePopup>

      {/* 심방 상세정보 팝업*/}
      <WrappedPagePopup
        isShow={openedDomain === DOMAIN.VISITATION}
        onClickClose={onClickClose}
        headerTitle={targetVisitation?.title}
        hideCancel={true}
        hideDone={true}
        stageThreeTop={250}
        stageTwoTop={40}
        inCharge={targetVisitation.inCharge}
        startDate={targetVisitation.startDate}
        endDate={targetVisitation.endDate}
        status={targetVisitation.status}
        onChangeStatus={onChangeVisitationStatus}
      >
        <VisitationInformation onChangeStatus={onChangeVisitationStatus} />
      </WrappedPagePopup>

      {/* 교육회차 상세정보 팝업*/}
      <WrappedPagePopup
        keyboardDisabled={true}
        isShow={openedDomain === DOMAIN.EDUCATION_SESSION}
        onClickClose={onClickClose}
        headerTitle={`${targetEducationTerm.educationName} - ${getTranslatedTerm(locale, targetEducationTerm.term)} - ${targetEducationSession.session}${t('session')} ${targetEducationSession.title}`}
        hideCancel={true}
        hideDone={true}
        stageTwoTop={40}
        stageThreeTop={250}
        status={targetEducationSession.status}
        inCharge={targetEducationSession.inCharge}
        startDate={targetEducationSession.startDate}
        endDate={targetEducationSession.endDate}
        onChangeStatus={onChangeEducationSessionStatus}
      >
        {(scrollRef) => (
          <>
            <EducationSessionInformation
              scrollRef={scrollRef}
              onChangeStatus={onChangeEducationSessionStatus}
            />
          </>
        )}
      </WrappedPagePopup>

      {/* 교인 상세정보 팝업*/}
      <SlidePopup
        isShow={openedDomain === DOMAIN.MEMBER}
        onClickClose={onClickClose}
        isFooterShown={false}
        headerTitle={t('header.memberInformation')}
        headerRight={
          <ButtonRow>
            <ButtonContainer onClick={onClickClose}>
              <Cancel />
            </ButtonContainer>
          </ButtonRow>
        }
      >
        <MemberInformation />
      </SlidePopup>

      {/* 교회 이벤트 팝업*/}
      <CustomPopup
        isShow={openedDomain === DOMAIN.CHURCH_EVENT}
        width={500}
        height={300}
        onClickCancel={onClickClose}
        isFooterShown={false}
        headerTitle={t('title.churchEventInformation')}
        headerRight={
          <ButtonRow>
            <ButtonContainer onClick={onClickClose}>
              <Cancel />
            </ButtonContainer>
          </ButtonRow>
        }
      >
        <ChurchEventInformation />
      </CustomPopup>
    </CalendarContainer>
  );
};

export default MainCalendarView;
