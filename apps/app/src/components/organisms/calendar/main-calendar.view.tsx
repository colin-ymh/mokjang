import CustomCalendar from '../../../vendor/calendar/custom-calendar';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { DOMAIN, Schedule } from '@mokjang/models';
import { Svg } from '@mokjang/assets';
import { BLACK, LOCALE, MAIN, TASK_STATUS } from '@mokjang/constants';
import SlidePopup from '../../atoms/common/popup/slide-popup';
import TaskInformation from '../task/information/task-information';
import React from 'react';
import VisitationInformation from '../visitation/information/visitation-information';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import MemberInformation from '../member/information/member-information';
import ChurchEventInformation from '../church-event/information/church-event-information';
import { CustomPopup } from '@mokjang/components';
import WrappedPagePopup from '../../atoms/common/popup/wrapped-page-popup';
import { getTranslatedTerm } from '@mokjang/utils';
import EducationSessionInformation from '../education/education-session/information/education-session-information';
import { usePathname } from 'next/navigation';
import ScrollSlidePopup from '@/components/atoms/common/popup/scroll-slide-popup';
import AddChurchEvent from '@/components/organisms/church-event/add/add-church-event';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import useWindowSize from '@/hooks/window/window';

const CalendarContainer = styled.div`
  display: flex;
  padding: 20px;
`;

const CalendarWrapper = styled.div<{ height: number }>`
  display: flex;
  width: 100%;
  height: ${({ height }) => height}px;
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 테두리 대신 그림자 */
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

const Cancel = styled(Svg.Cancel)`
  width: 30px;
  height: 30px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;

type MainCalendarViewProps = {
  date: Date;
  openedDomain: DOMAIN | null;
  isEventEditShown: boolean;
  isEventSaveEnable: boolean;
  isEventDeleteShown: boolean;
  onClickClose: () => void;
  onChangeDate: (date: Date) => void;
  onSelectSchedule: (event: Schedule) => void;
  onChangeTaskStatus: (status: TASK_STATUS) => void;
  onChangeVisitationStatus: (status: TASK_STATUS) => void;
  onChangeEducationSessionStatus: (status: TASK_STATUS) => void;
  onClickEventEditOpen: () => void;
  onClickEventEditClose: () => void;
  onClickEventEditDone: () => void;
  onClickEventDelete: () => void;
  onClickEventDeleteOpen: () => void;
  onClickEventDeleteClose: () => void;
};

const MainCalendarView = ({
  date,
  openedDomain,
  isEventEditShown,
  isEventSaveEnable,
  isEventDeleteShown,
  onClickClose,
  onChangeDate,
  onSelectSchedule,
  onChangeTaskStatus,
  onChangeVisitationStatus,
  onChangeEducationSessionStatus,
  onClickEventEditOpen,
  onClickEventEditClose,
  onClickEventEditDone,
  onClickEventDelete,
  onClickEventDeleteOpen,
  onClickEventDeleteClose,
}: MainCalendarViewProps) => {
  const { calendarSchedules } = useSelector(
    (state: RootState) => state.calendarFilter
  );
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const { height } = useWindowSize();

  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_title = useScopedI18n('title');
  const t_popup = useScopedI18n('popup');

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
      <CalendarWrapper height={height - 110}>
        <CustomCalendar
          date={date}
          onChangeDate={onChangeDate}
          schedules={calendarSchedules}
          onSelectSchedule={onSelectSchedule}
        />
      </CalendarWrapper>

      {/* 업무 상세정보 팝업*/}
      <ScrollSlidePopup
        isShow={openedDomain === DOMAIN.TASK}
        onClickClose={onClickClose}
        onClickCancel={onClickClose}
        headerTitle={targetTask?.title}
        stageTwoTop={40}
        inCharge={targetTask?.inCharge}
        startDate={targetTask?.startDate}
        endDate={targetTask?.endDate}
        status={targetTask.status}
        onChangeStatus={onChangeTaskStatus}
      >
        <TaskInformation onChangeStatus={onChangeTaskStatus} />
      </ScrollSlidePopup>

      {/* 심방 상세정보 팝업*/}
      <ScrollSlidePopup
        isShow={openedDomain === DOMAIN.VISITATION}
        onClickClose={onClickClose}
        onClickCancel={onClickClose}
        headerTitle={targetVisitation?.title}
        stageTwoTop={40}
        inCharge={targetVisitation.inCharge}
        startDate={targetVisitation.startDate}
        endDate={targetVisitation.endDate}
        status={targetVisitation.status}
        onChangeStatus={onChangeVisitationStatus}
      >
        <VisitationInformation onChangeStatus={onChangeVisitationStatus} />
      </ScrollSlidePopup>

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
        onClickCancel={onClickClose}
        cancelText={t_button('close')}
      >
        <MemberInformation />
      </SlidePopup>

      {/* 교회 이벤트 팝업*/}
      <CustomPopup
        isShow={openedDomain === DOMAIN.CHURCH_EVENT}
        width={500}
        height={300}
        onClickCancel={onClickEventDeleteOpen}
        onClickClose={onClickClose}
        onClickDone={onClickEventEditOpen}
        cancelText={t_button('delete')}
        doneText={t_button('edit')}
        headerTitle={t('title.churchEventInformation')}
        keyboardDisabled={true}
      >
        <>
          <ConfirmPopup
            title={t_popup('deleteChurchEventTitle')}
            body={t_popup('deleteChurchEventBody')}
            buttonNum={2}
            isShow={isEventDeleteShown}
            onClickLeftButton={onClickEventDeleteClose}
            onClickRightButton={onClickEventDelete}
            leftButtonText={t_button('cancel')}
            rightButtonText={t_button('delete')}
          />
          <ChurchEventInformation />
        </>
      </CustomPopup>

      {/* 이벤트 수정 팝업 */}
      <CustomPopup
        isShow={isEventEditShown}
        onClickClose={onClickEventEditClose}
        onClickCancel={onClickEventEditClose}
        headerTitle={t_title('editChurchEvent')}
        width={500}
        height={500}
        onClickDone={onClickEventEditDone}
        doneBackgroundColor={isEventSaveEnable ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isEventSaveEnable}
        cancelText={t_button('cancel')}
        doneText={t_button('save')}
      >
        <AddChurchEvent />
      </CustomPopup>
    </CalendarContainer>
  );
};

export default MainCalendarView;
