import styled from 'styled-components';
import FakeDropdownButton from '@/components/atoms/common/button/fake-dropdown-button';
import { Group } from '@/models/management/management';
import { useI18n } from '../../../../locales/client';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import SelectGroupHierarchy from '@/components/atoms/group/select-group-hierarchy';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';

const AttendanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  flex-shrink: 0;
  position: relative;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
`;

const GroupContainer = styled.div`
  display: flex;
  padding: 10px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-shrink: 0;
`;

type AttendanceViewProps = {
  isGroupModalShown: boolean;
  group: Group;
  worshipId: string | undefined;
  onChangeGroup: (id: string | null) => void;
  onChangeWorship: (id: string) => void;
  onClickOpenGroupModal: () => void;
  onClickCloseGroupModal: () => void;
  onClickSavePeriod: (startDate: string, endDate: string) => void;
};

const AttendanceRow = ({
  isGroupModalShown,
  group,
  worshipId,
  onChangeGroup,
  onChangeWorship,
  onClickOpenGroupModal,
  onClickCloseGroupModal,
  onClickSavePeriod,
}: AttendanceViewProps) => {
  const t = useI18n();
  const { worships } = useSelector((state: RootState) => state.worshipFilter);

  const worshipDropdownItems = [
    {
      value: undefined,
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
        <FakeDropdownButton
          title={group.name || t('all')}
          isOpened={isGroupModalShown}
          onClick={onClickOpenGroupModal}
          width={150}
        />
        <Dropdown
          value={worshipId}
          items={worshipDropdownItems}
          onChangeItem={onChangeWorship}
          width={150}
        />
      </LeftContainer>
      <RightContainer></RightContainer>

      <CustomPopup
        isShow={isGroupModalShown}
        onClickCancel={onClickCloseGroupModal}
        width={400}
        height={600}
      >
        <GroupContainer>
          <SelectGroupHierarchy isDefaultOpen onChange={onChangeGroup} />
        </GroupContainer>
      </CustomPopup>
    </AttendanceContainer>
  );
};

export default AttendanceRow;
