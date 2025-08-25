import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';

import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import React from 'react';
import { SIZE } from '@/constants/styles/style';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDayConstantByIndex,
  getWeekRepeatConstant,
} from '@/utils/date';
import { useWorshipPeriodDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { DAY, REPEAT_PERIOD, WORSHIP_PERIOD } from '@/constants/constant';
import { MemberAttendanceStatistic, Worship } from '@/models/worship/worship';
import { GRAY, MAIN } from '@/constants/styles/color';
import { getTranslatedMemberAttendanceCount } from '@/utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import MemberAttendanceTable from '@/components/molecules/member/information/attendance/member-attendance-table';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
`;

const AttendanceListHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const StatisticContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  background-color: ${MAIN.EXTRA_LIGHT};
  border: 1px solid ${MAIN.LIGHT};
  padding: 30px;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 10px;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 10px;
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
  const t_header = useScopedI18n('header');

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

  return (
    <>
      <ListContainer>
        {/* 심방 목록 헤더 */}
        <AttendanceListHeader>
          <MainText size={SIZE.EXTRA_LARGE}>
            {t_header('memberAttendance')}
          </MainText>
          <DropdownContainer>
            {/* 예배 설정 */}
            <Dropdown
              value={targetWorship.id}
              items={worshipDropdownItems}
              onChangeItem={onClickWorshipItem}
              width={120}
              height={30}
            />
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

            {/* 기간 드롭다운 */}
            <Dropdown
              value={worshipPeriod}
              items={worshipPeriodDropdownItems}
              onChangeItem={onChangeWorshipPeriodDropdown}
              width={100}
              height={30}
            />
          </DropdownContainer>
        </AttendanceListHeader>
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
              color={MAIN.DEFAULT}
            >{`${statistic.checkRate}%`}</MainText>
            <MainText color={GRAY.DEFAULT}>
              {getTranslatedMemberAttendanceCount(
                basePath,
                statistic.presentCount,
                statistic.totalSessions
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
