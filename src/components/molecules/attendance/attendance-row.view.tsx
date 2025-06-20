import styled from 'styled-components';
import FakeDropdownButton from '@/components/atoms/common/button/fake-dropdown-button';
import { Group } from '@/models/management/management';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import SelectGroupHierarchy from '@/components/organisms/group/select-group-hierarchy';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import { BLANK } from '@/constants/constant';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateFromString,
  getDateStringFromDate,
} from '@/utils/date';
import React from 'react';
import Button from '@/components/atoms/common/button/button';

const AttendanceContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  flex-shrink: 0;
  position: relative;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const GroupContainer = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

type AttendanceViewProps = {
  isGroupModalShown: boolean;
  topLevelGroup: Group;
  onChangeGroup: (id: string | null) => void;
  onChangeWorship: (id: string) => void;
  onClickOpenGroupModal: () => void;
  onClickCloseGroupModal: () => void;
  onChangeFromDate: (date: Date | null) => void;
  onChangeToDate: (date: Date | null) => void;
  onClickSavePeriod: () => void;
};

const AttendanceRow = ({
  isGroupModalShown,
  topLevelGroup,
  onChangeGroup,
  onChangeWorship,
  onClickOpenGroupModal,
  onClickCloseGroupModal,
  onChangeFromDate,
  onChangeToDate,
  onClickSavePeriod,
}: AttendanceViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const { worships } = useSelector((state: RootState) => state.worshipFilter);
  const { targetWorship, targetWorshipGroup } = useSelector(
    (state: RootState) => state.targetWorship
  );
  const { worshipEnrollmentFilter } = useSelector(
    (state: RootState) => state.worshipEnrollmentFilter
  );

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
    <AttendanceContainer>
      <LeftContainer>
        {/* 그룹 범위 설정*/}
        <FakeDropdownButton
          title={targetWorshipGroup.name || t('all')}
          isOpened={isGroupModalShown}
          onClick={onClickOpenGroupModal}
          width={150}
        />
        {/* 예배 설정 */}
        <Dropdown
          value={targetWorship.id}
          items={worshipDropdownItems}
          onChangeItem={onChangeWorship}
          width={150}
        />
      </LeftContainer>
      <RightContainer>
        {/* 시작 날짜 */}
        <CustomDatePicker
          value={
            worshipEnrollmentFilter.fromSessionDate
              ? getDateStringFromDate(
                  getDateFromDateString(worshipEnrollmentFilter.fromSessionDate)
                )
              : undefined
          }
          selected={
            worshipEnrollmentFilter.fromSessionDate
              ? getDateFromString(worshipEnrollmentFilter.fromSessionDate)
              : null
          }
          onChange={onChangeFromDate}
          placeholderText={t('startDate')}
          width={100}
        />

        {/* 종료 날짜 */}
        <CustomDatePicker
          value={
            worshipEnrollmentFilter.toSessionDate
              ? getDateStringFromDate(
                  getDateFromDateString(worshipEnrollmentFilter.toSessionDate)
                )
              : undefined
          }
          selected={
            worshipEnrollmentFilter.toSessionDate
              ? getDateFromString(worshipEnrollmentFilter.toSessionDate)
              : null
          }
          onChange={onChangeToDate}
          placeholderText={t('endDate')}
          width={100}
        />

        {/* 조회 */}
        <Button
          text={t_button('check')}
          onClick={onClickSavePeriod}
          width={60}
        />
      </RightContainer>

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
            onChange={onChangeGroup}
            topLevelGroupId={topLevelGroup.id}
          />
        </GroupContainer>
      </CustomPopup>
    </AttendanceContainer>
  );
};

export default AttendanceRow;
