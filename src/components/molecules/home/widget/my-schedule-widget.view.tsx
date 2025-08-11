'use client';

import { MainText } from '@/components/atoms/common/text/main-text';
import styled from 'styled-components';
import { SIZE } from '@/constants/styles/style';
import { BLACK } from '@/constants/styles/color';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { HOME_WIDGET, RANGE } from '@/constants/constant';
import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import { DOMAIN } from '@/models/permission/permission';
import TaskInformation from '@/components/organisms/task/information/task-information';
import VisitationInformation from '@/components/organisms/visitation/information/visitation-information';
import EducationSessionInformation from '@/components/organisms/education/education-session/information/education-session-information';
import React from 'react';
import { Schedule } from '@/models/calendar/calendar';
import CancelIcon from '../../../../../public/svg/cancel.svg';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ToggleRadioButton from '@/components/atoms/common/radio-button/toggle-radio-button';
import { useWeekMonthRangeRadioButtonItems } from '@/hooks/radio-button/radio-button-items';
import MyScheduleList from '@/components/atoms/home/my-schedule-list';

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 10px;
`;

const WidgetHeader = styled.div`
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
`;

const Cancel = styled(CancelIcon)`
  width: 30px;
  height: 30px;
  stroke: ${BLACK};
  stroke-width: 1px;
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

type MyScheduleWidgetViewProps = {
  openedDomain: DOMAIN | null;
  range: RANGE;
  mySchedules: Schedule[];
  onClickSchedule: (schedule: Schedule) => void;
  onClickClose: () => void;
  onClickRange: (range: RANGE) => void;
};

const MyScheduleWidgetView = ({
  openedDomain,
  range,
  mySchedules,
  onClickSchedule,
  onClickClose,
  onClickRange,
}: MyScheduleWidgetViewProps) => {
  const t = useI18n();
  const t_title = useScopedI18n('title');

  const { targetTask } = useSelector((state: RootState) => state.targetTask);
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
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
            {t_title(HOME_WIDGET.MY_SCHEDULE)}
          </MainText>
          <ToggleRadioButton
            selectedValue={range}
            onChange={onClickRange}
            items={rangeRadioItems}
          />
        </WidgetHeader>

        {/* 일정 목록 */}
        <MyScheduleList
          mySchedules={mySchedules}
          onClickSchedule={onClickSchedule}
        />
      </WidgetContainer>

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
        {openedDomain === DOMAIN.TASK && <TaskInformation />}
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
        {openedDomain === DOMAIN.VISITATION && <VisitationInformation />}
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
        {openedDomain === DOMAIN.EDUCATION && <EducationSessionInformation />}
      </SlidePopup>
    </>
  );
};

export default MyScheduleWidgetView;
