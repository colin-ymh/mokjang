import CustomCalendar from '@/vendor/calendar/custom-calendar';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { CalendarEvent } from '@/models/calendar/calendar';
import CancelIcon from '../../../../public/svg/cancel.svg';
import { BLACK } from '@/constants/styles/color';
import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import { DOMAIN } from '@/models/permission/permission';
import TaskInformation from '@/components/organisms/task/information/task-information';
import React from 'react';
import VisitationInformation from '@/components/organisms/visitation/information/visitation-information';
import { useI18n } from '../../../../locales/client';
import EducationSessionInformation from '@/components/organisms/education/education-session/information/education-session-information';
import MemberInformation from '@/components/organisms/member/information/member-information';
import ChurchEventInformation from '@/components/organisms/church-event/information/church-event-information';

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
  onSelectEvent: (event: CalendarEvent) => void;
};

const MainCalendarView = ({
  date,
  openedDomain,
  onClickClose,
  onChangeDate,
  onSelectEvent,
}: MainCalendarViewProps) => {
  const t = useI18n();
  const { calendarEvents } = useSelector(
    (state: RootState) => state.calendarFilter
  );

  const { targetTask } = useSelector((state: RootState) => state.targetTask);
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );
  const { targetChurchEvent } = useSelector(
    (state: RootState) => state.targetChurchEvent
  );

  return (
    <CalendarContainer>
      {/* 달력 */}
      <CustomCalendar
        date={date}
        onChangeDate={onChangeDate}
        events={calendarEvents}
        onSelectEvent={onSelectEvent}
      />

      {/* 업무 상세정보 팝업*/}
      <SlidePopup
        isShow={openedDomain === DOMAIN.TASK}
        onClickClose={onClickClose}
        isFooterShown={false}
        headerTitle={targetTask?.title}
        headerRight={
          <ButtonRow>
            <ButtonContainer onClick={onClickClose}>
              <Cancel />
            </ButtonContainer>
          </ButtonRow>
        }
      >
        <TaskInformation />
      </SlidePopup>

      {/* 심방 상세정보 팝업*/}
      <SlidePopup
        isShow={openedDomain === DOMAIN.VISITATION}
        onClickClose={onClickClose}
        isFooterShown={false}
        headerTitle={targetVisitation?.title}
        headerRight={
          <ButtonRow>
            <ButtonContainer onClick={onClickClose}>
              <Cancel />
            </ButtonContainer>
          </ButtonRow>
        }
      >
        <VisitationInformation />
      </SlidePopup>

      {/* 교육 상세정보 팝업*/}
      <SlidePopup
        isShow={openedDomain === DOMAIN.EDUCATION}
        onClickClose={onClickClose}
        isFooterShown={false}
        headerTitle={`${targetEducationSession.session}${t('session')} ${targetEducationSession.title}`}
        headerRight={
          <ButtonRow>
            <ButtonContainer onClick={onClickClose}>
              <Cancel />
            </ButtonContainer>
          </ButtonRow>
        }
      >
        <EducationSessionInformation />
      </SlidePopup>

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

      {/* 교인 상세정보 팝업*/}
      <SlidePopup
        isShow={openedDomain === DOMAIN.CHURCH_EVENT}
        onClickClose={onClickClose}
        isFooterShown={false}
        headerTitle={targetChurchEvent.title}
        headerRight={
          <ButtonRow>
            <ButtonContainer onClick={onClickClose}>
              <Cancel />
            </ButtonContainer>
          </ButtonRow>
        }
      >
        <ChurchEventInformation />
      </SlidePopup>
    </CalendarContainer>
  );
};

export default MainCalendarView;
