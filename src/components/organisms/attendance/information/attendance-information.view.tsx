import styled from 'styled-components';
import React from 'react';
import FakeDropdownButton from '@/components/atoms/common/button/fake-dropdown-button';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n } from '../../../../../locales/client';
import { BLANK } from '@/constants/constant';
import { Group } from '@/models/management/management';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import SelectGroupHierarchy from '@/components/organisms/group/select-group-hierarchy';
import AttendanceInformationTable from '@/components/molecules/attendance/information/attendance-information-table';
import WeekNavigator from '@/components/atoms/common/date/week-navigator';
import { getDateFromDateString } from '@/utils/date';

const AttendanceInformationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 25px 20px 20px 20px;
  gap: 20px;
  overflow-y: auto;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
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
`;

const GroupContainer = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
`;

type AttendanceInformationProps = {
  isGroupModalShown: boolean;
  topLevelGroup: Group;
  onClickGroupItem: (id: string | null) => void;
  onClickWorshipItem: (id: string) => void;
  onClickOpenGroupModal: () => void;
  onClickCloseGroupModal: () => void;
  onChangeDate: (date: Date) => void;
  loadWorshipAttendances: () => Promise<void>;
};

const AttendanceInformation = ({
  isGroupModalShown,
  topLevelGroup,
  onClickGroupItem,
  onClickWorshipItem,
  onClickOpenGroupModal,
  onClickCloseGroupModal,
  onChangeDate,
  loadWorshipAttendances,
}: AttendanceInformationProps) => {
  const t = useI18n();
  const {
    targetWorshipSession,
    targetWorshipSessionGroup,
    targetWorshipSessionWorship,
  } = useSelector((state: RootState) => state.targetWorshipSession);
  const { worships } = useSelector((state: RootState) => state.worshipFilter);

  const worshipDropdownItems = [
    {
      value: BLANK,
      title: t('none'),
    },
    ...worships.map((worship) => {
      return {
        value: worship.id,
        title: worship.title,
      };
    }),
  ];

  return (
    <AttendanceInformationContainer>
      {/* 필터 행 */}
      <RowContainer>
        <LeftContainer>
          {/* 그룹 범위 설정*/}
          <FakeDropdownButton
            title={targetWorshipSessionGroup.name || t('all')}
            isOpened={isGroupModalShown}
            onClick={onClickOpenGroupModal}
            width={120}
            height={40}
          />
          {/* 예배 설정 */}
          <Dropdown
            value={targetWorshipSessionWorship.id}
            items={worshipDropdownItems}
            onChangeItem={onClickWorshipItem}
            width={120}
            height={40}
          />
        </LeftContainer>
        <RightContainer>
          <WeekNavigator
            value={getDateFromDateString(targetWorshipSession.sessionDate)}
            dayOfWeek={targetWorshipSessionWorship.worshipDay}
            weekPeriod={targetWorshipSessionWorship.repeatPeriod}
            onChange={onChangeDate}
          />
        </RightContainer>
      </RowContainer>

      {/* 출석부 목록 */}
      <AttendanceInformationTable
        loadWorshipAttendances={loadWorshipAttendances}
      />

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
    </AttendanceInformationContainer>
  );
};

export default AttendanceInformation;
