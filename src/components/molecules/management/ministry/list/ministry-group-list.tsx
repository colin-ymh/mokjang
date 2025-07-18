import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MinistryGroup } from '@/models/management/management';
import MinistryGroupListView from '@/components/molecules/management/ministry/list/ministry-group-list.view';

type MinistryGroupListProps = {
  selectedMinistryGroupId: string | null;
  onClickMinistryGroup: (ministryGroup: MinistryGroup) => void;
};

const MinistryGroupList = ({
  selectedMinistryGroupId,
  onClickMinistryGroup,
}: MinistryGroupListProps) => {
  const { ministryGroups } = useSelector((state: RootState) => state.church);

  // 닫혀있는 그룹들
  const [closedMinistryGroups, setClosedMinistryGroups] = useState<Set<number>>(
    new Set()
  );

  // 그룹 열고 닫기
  const onClickToggle = (id: string) => {
    const ID = parseInt(id);

    setClosedMinistryGroups((prevClosedGroups) => {
      const newClosedGroups = new Set(prevClosedGroups);
      if (newClosedGroups.has(ID)) {
        newClosedGroups.delete(ID); // 이미 닫혀있으면 열기
      } else {
        newClosedGroups.add(ID); // 닫힌 상태로 추가
      }
      return newClosedGroups;
    });
  };

  const props = {
    ministryGroups,
    closedMinistryGroups,
    selectedMinistryGroupId,
    onClickMinistryGroup,
    onClickToggle,
  };

  return (
    <>
      <MinistryGroupListView {...props} />
    </>
  );
};

export default MinistryGroupList;
