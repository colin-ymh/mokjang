import styled from 'styled-components';
import React from 'react';
import FakeDropdownButton from '../../../atoms/common/button/fake-dropdown-button';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { Group } from '@mokjang/models';
import { Button, CustomPopup, MainText } from '@mokjang/components';
import SelectGroupHierarchy from '../../group/select-group-hierarchy';
import WeekNavigator from '../../../atoms/common/date/week-navigator';
import { getDateFromDateString, getDateStringFromDate } from '@mokjang/utils';
import { GRAY, GREEN, RED, SIZE } from '@mokjang/constants';
import AttendanceInformationTable from '../../../molecules/attendance/information/attendance-information-table';
import WorshipSessionInformation from '../../../molecules/attendance/information/worship-session-information';
import LabelDropdown from '../../../atoms/common/dropdown/label-dropdown';
import { getWorshipAttendanceRateColor } from '../../../../utils/color';

const AttendanceInformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TitleContainer = styled.div`
  display: flex;
  padding: 0 40px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 40px;
  gap: 20px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid ${GRAY.LIGHT};
`;

const GroupContainer = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
`;

const StatisticsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const StatisticItem = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const TableContainer = styled.div`
  display: flex;
  border-radius: 10px;
  border: 1px solid ${GRAY.LIGHT};
  overflow: hidden;
`;

type AttendanceInformationProps = {
  isGroupModalShown: boolean;
  topLevelGroup: Group;
  onClickGroupItem: (id: string | null) => void;
  onClickWorshipItem: (id: string) => void;
  onClickOpenGroupModal: () => void;
  onClickCloseGroupModal: () => void;
  onChangeDate: (date: Date) => void;
  onClickAllAttended: () => void;
  fetchSessionStatistic: () => void;
};

const AttendanceInformation = ({
  isGroupModalShown,
  topLevelGroup,
  onClickGroupItem,
  onClickWorshipItem,
  onClickOpenGroupModal,
  onClickCloseGroupModal,
  onChangeDate,
  onClickAllAttended,
  fetchSessionStatistic,
}: AttendanceInformationProps) => {
  const t = useI18n();
  const t_title = useScopedI18n('title');
  const {
    targetWorshipSession,
    targetWorshipSessionGroup,
    targetWorshipSessionWorship,
    targetWorshipSessionStatistic,
  } = useSelector((state: RootState) => state.targetWorshipSession);
  const { worships } = useSelector((state: RootState) => state.worshipFilter);

  const worshipDropdownItems = worships.map((worship) => {
    return {
      value: worship.id,
      title: worship.title,
    };
  });

  return (
    <>
      <AttendanceInformationContainer>
        <TitleContainer>
          <MainText size={SIZE.EXTRA_LARGE} fontSize={22}>
            {`${targetWorshipSessionWorship.title} ${t_title('attendanceInformation')} (${getDateStringFromDate(getDateFromDateString(targetWorshipSession.sessionDate))})`}
          </MainText>
        </TitleContainer>
        <ContentContainer>
          {/* 필터 행 */}
          <BoxContainer>
            <LabelContainer>
              <MainText color={GRAY.DARK} size={SIZE.SMALL}>
                {t('group')}
              </MainText>
              <FakeDropdownButton
                title={targetWorshipSessionGroup.name || t('all')}
                isOpened={isGroupModalShown}
                onClick={onClickOpenGroupModal}
                height={40}
              />
            </LabelContainer>
            {/* 예배 설정 */}
            <LabelDropdown
              label={t('worship')}
              value={targetWorshipSessionWorship.id}
              items={worshipDropdownItems}
              onChangeItem={onClickWorshipItem}
              height={40}
            />
            <WeekNavigator
              value={getDateFromDateString(targetWorshipSession.sessionDate)}
              dayOfWeek={targetWorshipSessionWorship.worshipDay}
              weekPeriod={targetWorshipSessionWorship.repeatPeriod}
              onChange={onChangeDate}
            />
          </BoxContainer>
          {/* 예배 내용 */}
          <BoxContainer>
            <WorshipSessionInformation />
          </BoxContainer>
          {/* 회차 통계 */}
          <BoxContainer>
            <StatisticsContainer>
              <StatisticItem>
                <MainText size={SIZE.EXTRA_LARGE}>
                  {targetWorshipSessionStatistic.totalCount}
                </MainText>
                <MainText size={SIZE.SMALL} color={GRAY.DARK}>
                  {t('worshipSessionAttendanceCount')}
                </MainText>
              </StatisticItem>
              <StatisticItem>
                <MainText size={SIZE.EXTRA_LARGE} color={GREEN.DEFAULT}>
                  {targetWorshipSessionStatistic.presentCount}
                </MainText>
                <MainText size={SIZE.SMALL} color={GRAY.DARK}>
                  {t('present')}
                </MainText>
              </StatisticItem>
              <StatisticItem>
                <MainText size={SIZE.EXTRA_LARGE} color={RED.DEFAULT}>
                  {targetWorshipSessionStatistic.absentCount}
                </MainText>
                <MainText size={SIZE.SMALL} color={GRAY.DARK}>
                  {t('absent')}
                </MainText>
              </StatisticItem>
              <StatisticItem>
                <MainText
                  size={SIZE.EXTRA_LARGE}
                  color={getWorshipAttendanceRateColor(
                    (targetWorshipSessionStatistic.presentCount /
                      (targetWorshipSessionStatistic.totalCount -
                        targetWorshipSessionStatistic.unknownCount)) *
                      100 || 0
                  )}
                >
                  {`${
                    Math.round(
                      (targetWorshipSessionStatistic.presentCount /
                        (targetWorshipSessionStatistic.totalCount -
                          targetWorshipSessionStatistic.unknownCount)) *
                        100
                    ) || 0
                  }%`}
                </MainText>
                <MainText size={SIZE.SMALL} color={GRAY.DARK}>
                  {t('worshipSessionAttendanceRate')}
                </MainText>
              </StatisticItem>
            </StatisticsContainer>
          </BoxContainer>
          {/* 검색창 */}
          <RowContainer>
            <div />
            {/*<BorderInput value={searchText} onChange={onChangeSearchText} />*/}
            <Button
              text={t('button.allAttended')}
              height={30}
              width={'auto'}
              backgroundColor={GREEN.DEFAULT}
              onClick={onClickAllAttended}
            />
          </RowContainer>
          {/* 출석 목록 */}
          <TableContainer>
            <AttendanceInformationTable
              fetchSessionStatistic={fetchSessionStatistic}
            />
          </TableContainer>
        </ContentContainer>
      </AttendanceInformationContainer>

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
          />
        </GroupContainer>
      </CustomPopup>
    </>
  );
};

export default AttendanceInformation;
