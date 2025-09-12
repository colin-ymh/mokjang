'use client';

import { MainText, ToggleRadioButton } from '@mokjang/components';
import styled from 'styled-components';
import {
  GRAY,
  HOME_WIDGET,
  LOCALE,
  MAIN,
  RANGE,
  SIZE,
  STATUS,
} from '@mokjang/constants';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { DOMAIN, ScheduleSummary } from '@mokjang/models';
import React from 'react';
import { useWeekMonthRangeRadioButtonItems } from '../../../../hooks/radio-button/radio-button-items';
import { usePathname } from 'next/navigation';
import Dropdown from '../../../atoms/common/dropdown/dropdown';
import { getTranslatedSummaryCount } from '@mokjang/utils';
import { getTotalScheduleCount } from '../../../../utils/summary';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 20px;
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const WeekList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  padding: 5px;
`;

const WeekContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const WeekBar = styled.div`
  display: flex;
  width: 100%;
  border-radius: 5px;
  height: 7px;
  background-color: ${GRAY.LIGHT};
  position: relative;
`;

const CountBar = styled.div<{ $count: number; max: number }>`
  width: ${({ $count, max }) => (max ? ($count / max) * 100 : 0)}%;
  border-radius: 5px;
  height: 7px;
  background-color: ${MAIN.DEFAULT};
  position: absolute;
  left: 0;
  transition: width 0.2s ease-in-out;
`;

type MyReportedScheduleWidgetViewProps = {
  domain: DOMAIN | undefined;
  scheduleSummary: ScheduleSummary;
  onClickRange: (value: RANGE) => void;
  onChangeDomain: (value: DOMAIN | undefined) => void;
};

const MyReportedScheduleWidgetView = ({
  domain,
  scheduleSummary,
  onClickRange,
  onChangeDomain,
}: MyReportedScheduleWidgetViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const t_title = useScopedI18n('title');

  const { myRange } = useSelector((state: RootState) => state.scheduleSummary);

  const rangeRadioItems = useWeekMonthRangeRadioButtonItems();
  const domainDropdownItems = [
    {
      value: undefined,
      title: t('all'),
    },
    {
      value: DOMAIN.TASK,
      title: t('task'),
    },
    {
      value: DOMAIN.VISITATION,
      title: t('visitation'),
    },
    {
      value: DOMAIN.EDUCATION_TERM,
      title: t('educationTerm'),
    },
    {
      value: DOMAIN.EDUCATION_SESSION,
      title: t('educationSession'),
    },
  ];

  return (
    <>
      <WidgetContainer>
        {/* 타이틀 */}
        <WidgetHeader>
          <MainText size={SIZE.EXTRA_LARGE}>
            {t_title(HOME_WIDGET.MY_SCHEDULE_SUMMARY)}
          </MainText>
        </WidgetHeader>
        <RowContainer>
          <ToggleRadioButton
            selectedValue={myRange}
            onChange={onClickRange}
            items={rangeRadioItems}
            columnPadding={6}
          />
          <Dropdown
            value={domain}
            items={domainDropdownItems}
            onChangeItem={onChangeDomain}
            width={150}
            height={35}
          />
        </RowContainer>
        {/* 통계 */}
        <BodyContainer>
          {/* 총합 */}
          <RowContainer>
            <MainText color={GRAY.SEMI_DARK}>
              {`${t('all')} ${t('schedule')}`}
            </MainText>
            <MainText fontSize={22} fontWeight={600}>
              {getTranslatedSummaryCount(
                locale,
                getTotalScheduleCount(scheduleSummary)
              )}
            </MainText>
          </RowContainer>
          <RowContainer>
            <MainText color={GRAY.SEMI_DARK}>{`${t('doneRate')}`}</MainText>
            <MainText fontSize={20} fontWeight={600} color={MAIN.DEFAULT}>
              {`${Math.round((scheduleSummary[STATUS.DONE] / getTotalScheduleCount(scheduleSummary)) * 100) || 0}%`}
            </MainText>
          </RowContainer>
        </BodyContainer>
        {/* 주 단위 상태바 */}
        <WeekList>
          {Object.keys(scheduleSummary).map((status) => {
            return (
              <WeekContainer key={status}>
                <RowContainer>
                  <MainText>
                    {t(
                      status as
                        | STATUS.RESERVE
                        | STATUS.DONE
                        | STATUS.IN_PROGRESS
                        | STATUS.PENDING
                    )}
                  </MainText>
                  <MainText color={GRAY.SEMI_DARK}>
                    {scheduleSummary[status as keyof ScheduleSummary]}
                  </MainText>
                </RowContainer>
                <WeekBar>
                  <CountBar
                    $count={scheduleSummary[status as keyof ScheduleSummary]}
                    max={getTotalScheduleCount(scheduleSummary)}
                  />
                </WeekBar>
              </WeekContainer>
            );
          })}
        </WeekList>
      </WidgetContainer>
    </>
  );
};

export default MyReportedScheduleWidgetView;
