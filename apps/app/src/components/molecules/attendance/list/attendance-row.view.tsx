import styled from 'styled-components';
import FakeDropdownButton from '../../../atoms/common/button/fake-dropdown-button';
import { Group } from '@mokjang/models';
import { useI18n } from '../../../../../locales/client';
import { CustomPopup } from '@mokjang/components';
import SelectGroupHierarchy from '../../../organisms/group/select-group-hierarchy';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import Dropdown from '../../../atoms/common/dropdown/dropdown';
import { ALL, DAY, REPEAT_PERIOD, WORSHIP_PERIOD } from '@mokjang/constants';
import CustomDatePicker from '../../../../vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateFromInput,
  getDateStringFromDate,
  getDayConstantByIndex,
  getWeekRepeatConstant,
  getWorshipSessionDates,
} from '@mokjang/utils';
import React from 'react';
import { useWorshipPeriodDropdownItems } from '../../../../hooks/dropdown/dropdown-items';
import { GRAY, GREEN, MAIN, PURPLE, WHITE } from '@mokjang/constants';
import { MainText } from '@mokjang/components';
import { SIZE } from '@mokjang/constants';
import {
  getTranslatedDateFromDateString,
  getTranslatedMemberCount,
} from '@mokjang/utils';

import { usePathname } from 'next/navigation';
import { LOCALE } from '@mokjang/constants';

import { Button } from '@mokjang/components';

import { Svg } from '@mokjang/assets';

const AttendanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  gap: 20px;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  position: relative;
`;

const DataContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  flex-direction: row;
  gap: 10px;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  padding: 15px;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
`;

const GroupContainer = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
`;

const Chevron = styled(Svg.ChevronLeft)<{
  $isOpened: boolean;
}>`
  cursor: pointer;
  transform: rotate(${({ $isOpened }) => ($isOpened ? '180deg' : '360deg')});
  width:25px;
  height:25px;
  stroke:${MAIN.DEFAULT}
  stroke-width: 2px;
  color:${MAIN.DEFAULT}
  transform: translateY(-50%)
    rotate(${({ $isOpened }) => ($isOpened ? '180deg' : '360deg')});
  transition: transform 0.2s ease;
`;

type AttendanceViewProps = {
  isGroupModalShown: boolean;
  isStatisticOpened: boolean;
  topLevelGroup: Group;
  worshipPeriod: WORSHIP_PERIOD;
  onClickStatisticChevron: () => void;
  onClickGroupItem: (id: string | null) => void;
  onClickWorshipItem: (id: string) => void;
  onClickOpenGroupModal: () => void;
  onClickCloseGroupModal: () => void;
  onChangeFromDate: (date: Date | null) => void;
  onChangeToDate: (date: Date | null) => void;
  onChangeWorshipPeriodDropdown: (value: WORSHIP_PERIOD) => void;
};

const AttendanceRow = ({
  isGroupModalShown,
  isStatisticOpened,
  topLevelGroup,
  worshipPeriod,
  onClickStatisticChevron,
  onClickGroupItem,
  onClickWorshipItem,
  onClickOpenGroupModal,
  onClickCloseGroupModal,
  onChangeFromDate,
  onChangeToDate,
  onChangeWorshipPeriodDropdown,
}: AttendanceViewProps) => {
  const t = useI18n();
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  const { worshipEnrollmentFilter, worshipEnrollmentTotalCount } = useSelector(
    (state: RootState) => state.worshipEnrollmentFilter
  );

  const { worships } = useSelector((state: RootState) => state.worshipFilter);
  const { targetWorship, targetWorshipGroup, targetWorshipStatistic } =
    useSelector((state: RootState) => state.targetWorship);

  const worshipDropdownItems = worships.map((worship) => {
    return {
      value: worship.id,
      title: worship.title,
    };
  });

  const worshipPeriodDropdownItems = useWorshipPeriodDropdownItems();

  const sessionDates = getWorshipSessionDates(
    getDateFromInput(worshipEnrollmentFilter.fromSessionDate),
    getDateFromInput(worshipEnrollmentFilter.toSessionDate),
    targetWorship.worshipDay,
    targetWorship.repeatPeriod
  );

  return (
    <>
      <AttendanceContainer>
        <HeaderContainer>
          <LeftContainer>
            {/* 예배 설정 */}
            <Dropdown
              value={targetWorship.id}
              items={worshipDropdownItems}
              onChangeItem={onClickWorshipItem}
              width={120}
            />
            {/* 그룹 범위 설정*/}
            <FakeDropdownButton
              title={
                targetWorshipGroup.name == ALL || !targetWorshipGroup.name
                  ? t('all')
                  : targetWorshipGroup.name
              }
              isOpened={isGroupModalShown}
              onClick={onClickOpenGroupModal}
              width={120}
            />
          </LeftContainer>
          <RightContainer>
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
            />

            {/* 기간 드롭다운 */}
            <Dropdown
              value={worshipPeriod}
              items={worshipPeriodDropdownItems}
              onChangeItem={onChangeWorshipPeriodDropdown}
              width={100}
            />
            <Button
              icon={<Chevron $isOpened={isStatisticOpened} />}
              onClick={onClickStatisticChevron}
              width={40}
              backgroundColor={WHITE}
              borderColor={GRAY.LIGHT}
            />
          </RightContainer>
        </HeaderContainer>
        <DataContainer $isShown={isStatisticOpened}>
          {/* 예배 정보 */}
          <BoxContainer>
            <MainText size={SIZE.SMALL} color={GRAY.SEMI_DARK}>
              {t('worshipInformation')}
            </MainText>
            <MainText size={SIZE.LARGE} fontWeight={600}>
              {targetWorship.title}
            </MainText>
            <MainText
              size={SIZE.SMALL}
              color={GRAY.SEMI_DARK}
            >{`${targetWorshipGroup.name || t('all')} · ${t(getWeekRepeatConstant(targetWorship.repeatPeriod) as REPEAT_PERIOD)} ${t(getDayConstantByIndex(targetWorship.worshipDay) as DAY)}`}</MainText>
          </BoxContainer>
          {/* 선택 그룹 */}
          <BoxContainer>
            <MainText color={PURPLE.DARK} size={SIZE.SMALL}>
              {t('worshipSelectedGroup')}
            </MainText>
            <MainText color={PURPLE.DARK} size={SIZE.LARGE} fontWeight={600}>
              {targetWorshipGroup.name || t('all')}
            </MainText>
            <MainText color={PURPLE.DARK} size={SIZE.SMALL}>
              {getTranslatedMemberCount(basePath, worshipEnrollmentTotalCount)}
            </MainText>
          </BoxContainer>
          {/* 평균 출석률 */}
          <BoxContainer>
            <MainText color={MAIN.DEFAULT} size={SIZE.SMALL}>
              {t('worshipAverageAttendanceRate')}
            </MainText>
            <MainText color={MAIN.DEFAULT} size={SIZE.LARGE} fontWeight={600}>
              {`${targetWorshipStatistic.attendanceRate.period}%`}
            </MainText>
          </BoxContainer>
          {/* 최근 예배일 */}
          <BoxContainer>
            <MainText color={GREEN.DEFAULT} size={SIZE.SMALL}>
              {t('worshipLastDate')}
            </MainText>
            <MainText color={GREEN.DEFAULT} size={SIZE.LARGE} fontWeight={600}>
              {sessionDates?.length > 0 &&
                getTranslatedDateFromDateString(
                  basePath,
                  getDateStringFromDate(sessionDates[sessionDates.length - 1])
                )}
            </MainText>
          </BoxContainer>
        </DataContainer>
      </AttendanceContainer>

      {/* 그룹 선택 모달 */}
      <CustomPopup
        isShow={isGroupModalShown}
        onClickCancel={onClickCloseGroupModal}
        width={400}
        height={600}
        isHeaderShown={false}
      >
        <GroupContainer>
          <SelectGroupHierarchy
            onChange={onClickGroupItem}
            topLevelGroupId={topLevelGroup.id}
            isNullable={false}
          />
        </GroupContainer>
      </CustomPopup>
    </>
  );
};

export default AttendanceRow;
