'use client';

import { MainText, ToggleRadioButton } from '@mokjang/components';
import styled from 'styled-components';
import {
  HOME_WIDGET,
  LOCALE,
  RANGE,
  SIZE,
  TASK_STATUS,
} from '@mokjang/constants';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { DOMAIN, Schedule } from '@mokjang/models';
import React, { RefObject } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ReportedScheduleList from '../../../atoms/home/reported-schedule-list';
import { useWeekMonthRangeRadioButtonItems } from '@/hooks/radio-button/radio-button-items';
import WrappedPagePopup from '../../../atoms/common/popup/wrapped-page-popup';
import TaskInformation from '../../../organisms/task/information/task-information';
import VisitationInformation from '../../../organisms/visitation/information/visitation-information';
import { getTranslatedTerm } from '@mokjang/utils';
import EducationSessionInformation from '../../../organisms/education/education-session/information/education-session-information';
import { usePathname } from 'next/navigation';
import EducationTermInformation from '../../../organisms/education/education-term/information/education-term-information';
import ScrollSlidePopup from '@/components/atoms/common/popup/scroll-slide-popup';

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
  justify-content: space-between;
  height: 40px;
  flex-shrink: 0;
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
            columnPadding={4}
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
        widthPercentage={45}
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
        widthPercentage={45}
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
