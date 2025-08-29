'use client';

import { MainText } from '../../../atoms/common/text/main-text';
import styled from 'styled-components';
import { SIZE } from '../../../../constants/styles/style';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { HOME_WIDGET, RANGE } from '../../../../constants/constant';
import { DOMAIN } from '../../../../models/permission/permission';
import React, { RefObject } from 'react';
import { Schedule } from '../../../../models/calendar/calendar';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import ReportedScheduleList from '../../../atoms/home/reported-schedule-list';
import ToggleRadioButton from '../../../atoms/common/radio-button/toggle-radio-button';
import { useWeekMonthRangeRadioButtonItems } from '../../../../hooks/radio-button/radio-button-items';
import { TASK_STATUS } from '../../../../constants/status/status';
import WrappedPagePopup from '../../../atoms/common/popup/wrapped-page-popup';
import TaskInformation from '../../../organisms/task/information/task-information';
import VisitationInformation from '../../../organisms/visitation/information/visitation-information';
import { getTranslatedTerm } from '../../../../utils/translate';
import EducationSessionInformation from '../../../organisms/education/education-session/information/education-session-information';
import { usePathname } from 'next/navigation';
import { LOCALE } from '../../../../constants/state/locale';
import EducationTermInformation from '../../../organisms/education/education-term/information/education-term-information';

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 10px;
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
`;

type ReportedScheduleWidgetViewProps = {
  scrollRef: RefObject<HTMLDivElement>;
  openedDomain: DOMAIN | null;
  range: RANGE;
  reportedSchedules: Schedule[];
  onClickSchedule: (schedule: Schedule) => void;
  onClickClose: () => void;
  onClickRange: (range: RANGE) => void;
  onChangeTaskStatus: (status: TASK_STATUS) => void;
  onChangeVisitationStatus: (status: TASK_STATUS) => void;
  onChangeEducationSessionStatus: (status: TASK_STATUS) => void;
  onChangeEducationTermStatus: (status: TASK_STATUS) => void;
};

const ReportedScheduleWidgetView = ({
  scrollRef,
  openedDomain,
  range,
  reportedSchedules,
  onClickSchedule,
  onClickClose,
  onClickRange,
  onChangeTaskStatus,
  onChangeVisitationStatus,
  onChangeEducationSessionStatus,
  onChangeEducationTermStatus,
}: ReportedScheduleWidgetViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const t_title = useScopedI18n('title');

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

  const rangeRadioItems = useWeekMonthRangeRadioButtonItems();

  return (
    <>
      <WidgetContainer>
        {/* 타이틀 */}
        <WidgetHeader>
          <MainText size={SIZE.EXTRA_LARGE}>
            {t_title(HOME_WIDGET.REPORTED_SCHEDULE)}
          </MainText>
          <ToggleRadioButton
            selectedValue={range}
            onChange={onClickRange}
            items={rangeRadioItems}
          />
        </WidgetHeader>

        {/* 일정 목록 */}
        <ReportedScheduleList
          scrollRef={scrollRef}
          mySchedules={reportedSchedules}
          onClickSchedule={onClickSchedule}
        />
      </WidgetContainer>

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

      {/* 교육기수 상세정보 팝업*/}
      <WrappedPagePopup
        keyboardDisabled={true}
        isShow={openedDomain === DOMAIN.EDUCATION_TERM}
        onClickClose={onClickClose}
        headerTitle={`${targetEducationTerm.educationName} - ${getTranslatedTerm(locale, targetEducationTerm.term)}`}
        hideCancel={true}
        hideDone={true}
        stageTwoTop={40}
        stageThreeTop={250}
        status={targetEducationTerm.status}
        onChangeStatus={onChangeEducationTermStatus}
        inCharge={targetEducationTerm.inCharge}
        startDate={targetEducationTerm.startDate}
        endDate={targetEducationTerm.endDate}
      >
        {(scrollRef) => (
          <>
            <EducationTermInformation
              scrollRef={scrollRef}
              onChangeStatus={onChangeEducationTermStatus}
            />
          </>
        )}
      </WrappedPagePopup>
    </>
  );
};

export default ReportedScheduleWidgetView;
