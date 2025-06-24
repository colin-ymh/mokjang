import styled from 'styled-components';
import FakeDropdownButton from '@/components/atoms/common/button/fake-dropdown-button';
import { Group } from '@/models/management/management';
import { useI18n } from '../../../../../locales/client';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import SelectGroupHierarchy from '@/components/organisms/group/select-group-hierarchy';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import { WORSHIP_PERIOD } from '@/constants/constant';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import { getDateFromDateString } from '@/utils/date';
import React from 'react';
import { useWorshipPeriodDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { GRAY } from '@/constants/styles/color';

const AttendanceContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  flex-shrink: 0;
  position: relative;
  border-bottom: 1px solid ${GRAY.LIGHT};
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
  worshipPeriod: WORSHIP_PERIOD;
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
  topLevelGroup,
  worshipPeriod,
  onClickGroupItem,
  onClickWorshipItem,
  onClickOpenGroupModal,
  onClickCloseGroupModal,
  onChangeFromDate,
  onChangeToDate,
  onChangeWorshipPeriodDropdown,
}: AttendanceViewProps) => {
  const t = useI18n();
  const { worshipEnrollmentFilter } = useSelector(
    (state: RootState) => state.worshipEnrollmentFilter
  );
  ``;
  const { worships } = useSelector((state: RootState) => state.worshipFilter);
  const { targetWorship, targetWorshipGroup } = useSelector(
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
    <AttendanceContainer>
      <LeftContainer>
        {/* 그룹 범위 설정*/}
        <FakeDropdownButton
          title={targetWorshipGroup.name || t('all')}
          isOpened={isGroupModalShown}
          onClick={onClickOpenGroupModal}
          width={120}
        />
        {/* 예배 설정 */}
        <Dropdown
          value={targetWorship.id}
          items={worshipDropdownItems}
          onChangeItem={onClickWorshipItem}
          width={120}
        />
      </LeftContainer>
      <RightContainer>
        {/* 시작 날짜 */}
        <CustomDatePicker
          selected={
            worshipEnrollmentFilter.fromSessionDate
              ? getDateFromDateString(worshipEnrollmentFilter.fromSessionDate)
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
            onChange={onClickGroupItem}
            topLevelGroupId={topLevelGroup.id}
          />
        </GroupContainer>
      </CustomPopup>
    </AttendanceContainer>
  );
};

export default AttendanceRow;
