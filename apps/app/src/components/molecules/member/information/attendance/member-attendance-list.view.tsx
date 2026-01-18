import styled from 'styled-components';
import { MainText } from '@mokjang/components';

import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import React from 'react';
import {
  DAY,
  GRAY,
  LOCALE,
  MEDIA_MIN_WIDTH,
  REPEAT_PERIOD,
  SIZE,
  WHITE,
  WORSHIP_PERIOD,
} from '@mokjang/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import Dropdown from '../../../../atoms/common/dropdown/dropdown';
import CustomDatePicker from '../../../../../vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDayConstantByIndex,
  getTranslatedMemberAttendanceCount,
  getTranslatedUnknownAttendanceCount,
  getWeekRepeatConstant,
} from '@mokjang/utils';
import { useWorshipPeriodDropdownItems } from '../../../../../hooks/dropdown/dropdown-items';
import { MemberAttendanceStatistic, Worship } from '@mokjang/models';
import { usePathname } from 'next/navigation';
import MemberAttendanceTable from './member-attendance-table';
import { getWorshipAttendanceRateColor } from '@/utils/color';
import { useIsMobile } from '@/hooks/window/window';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
`;

const DropdownContainer = styled.div`
  display: flex;
  gap: 10px;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    flex-direction: column;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    flex-direction: row;
  }
`;

const RowContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const StatisticContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  background-color: ${WHITE};
  border: 1px solid ${GRAY.LIGHT};
  padding: 30px;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  height: 50px;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-direction: column;
  height: 50px;
`;

const TableContainer = styled.div`
  display: flex;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  overflow: hidden;
`;

type MemberAttendanceListViewProps = {
  worships: Worship[];
  statistic: MemberAttendanceStatistic;
  worshipPeriod: WORSHIP_PERIOD;
  onClickWorshipItem: (id: string) => void;
  onChangeFromDate: (date: Date | null) => void;
  onChangeToDate: (date: Date | null) => void;
  onChangeWorshipPeriodDropdown: (value: WORSHIP_PERIOD) => void;
};

const MemberAttendanceListView = ({
  worships,
  statistic,
  worshipPeriod,
  onClickWorshipItem,
  onChangeFromDate,
  onChangeToDate,
  onChangeWorshipPeriodDropdown,
}: MemberAttendanceListViewProps) => {
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  const { worshipEnrollmentFilter } = useSelector(
    (state: RootState) => state.worshipEnrollmentFilter
  );

  const { targetWorship } = useSelector(
    (state: RootState) => state.targetWorship
  );

  const worshipDropdownItems = worships.map((worship) => {
    return {
      value: worship.id,
      title: worship.title,
    };
  });

  const worshipPeriodDropdownItems = useWorshipPeriodDropdownItems();

  const isMobile = useIsMobile();

  return (
    <>
      <ListContainer>
        <DropdownContainer>
          <RowContainer>
            {/* 예배 설정 */}
            <Dropdown
              value={targetWorship.id}
              items={worshipDropdownItems}
              onChangeItem={onClickWorshipItem}
              width={isMobile ? undefined : 120}
              height={30}
            />
            {/* 기간 드롭다운 */}
            <Dropdown
              value={worshipPeriod}
              items={worshipPeriodDropdownItems}
              onChangeItem={onChangeWorshipPeriodDropdown}
              width={isMobile ? undefined : 100}
              height={30}
            />
          </RowContainer>
          <RowContainer>
            {/* 시작 날짜 */}
            <CustomDatePicker
              selected={
                worshipEnrollmentFilter.fromSessionDate
                  ? getDateFromDateString(
                      worshipEnrollmentFilter.fromSessionDate
                    )
                  : null
              }
              onChange={onChangeFromDate}
              placeholderText={t('startDate')}
              width={120}
              height={30}
            />

            {/* 종료 날짜 */}
            <CustomDatePicker
              selected={
                worshipEnrollmentFilter.toSessionDate
                  ? getDateFromDateString(worshipEnrollmentFilter.toSessionDate)
                  : null
              }
              onChange={onChangeToDate}
              placeholderText={t('endDate')}
              width={120}
              height={30}
            />
          </RowContainer>
        </DropdownContainer>
        {/* 통계 */}
        <StatisticContainer>
          <LeftContainer>
            <MainText size={SIZE.EXTRA_LARGE}>{targetWorship.title}</MainText>
            <MainText
              color={GRAY.DEFAULT}
            >{`${t(getWeekRepeatConstant(targetWorship.repeatPeriod) as REPEAT_PERIOD)} ${t(getDayConstantByIndex(targetWorship.worshipDay) as DAY)}`}</MainText>
          </LeftContainer>
          <RightContainer>
            <MainText
              size={SIZE.EXTRA_LARGE}
              fontSize={24}
              color={getWorshipAttendanceRateColor(
                (Math.round(
                  statistic.presentCount /
                    (statistic.presentCount + statistic.absentCount)
                ) || 0) * 100
              )}
            >{`${(Math.round(statistic.presentCount / (statistic.presentCount + statistic.absentCount)) || 0) * 100}%`}</MainText>
            <MainText color={GRAY.DEFAULT}>
              {getTranslatedMemberAttendanceCount(
                basePath,
                statistic.presentCount,
                statistic.totalSessions
              )}{' '}
              {!isMobile &&
                statistic.totalSessions -
                  statistic.absentCount -
                  statistic.presentCount >
                  0 &&
                getTranslatedUnknownAttendanceCount(
                  basePath,
                  statistic.totalSessions -
                    statistic.absentCount -
                    statistic.presentCount
                )}
            </MainText>
          </RightContainer>
        </StatisticContainer>
        {/* 출석 목록 */}
        <TableContainer>
          <MemberAttendanceTable />
        </TableContainer>
      </ListContainer>
    </>
  );
};

export default MemberAttendanceListView;
