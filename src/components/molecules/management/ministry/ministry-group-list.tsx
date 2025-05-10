import { Dispatch, SetStateAction, useState } from 'react';

import { MinistryGroup } from '@/models/management/management';
import MinistryGroupListView from '@/components/molecules/management/ministry/ministry-group-list.view';

type MinistryGroupListProps = {
  selectedMinistryGroupId: string | null;
  setSelectedMinistryGroup: Dispatch<SetStateAction<MinistryGroup>>;
};

const MinistryGroupList = ({
  selectedMinistryGroupId,
  setSelectedMinistryGroup,
}: MinistryGroupListProps) => {
  // 닫혀있는 그룹들
  const [closedMinistryGroups, setClosedMinistryGroups] = useState<Set<number>>(
    new Set()
  );

  // 그룹 열고 닫기
  const onClickToggle = (id: string) => {
    const ID = parseInt(id);

    setClosedMinistryGroups((prevClosedMinistryGroups) => {
      const newClosedMinistryGroups = new Set(prevClosedMinistryGroups);
      if (newClosedMinistryGroups.has(ID)) {
        newClosedMinistryGroups.delete(ID); // 이미 닫혀있으면 열기
      } else {
        newClosedMinistryGroups.add(ID); // 닫힌 상태로 추가
      }
      return newClosedMinistryGroups;
    });
  };

  const props = {
    closedMinistryGroups,
    selectedMinistryGroupId,
    setSelectedMinistryGroup,
    onClickToggle,
  };
  return (
    <>
      <MinistryGroupListView {...props} />
    </>
  );
};

export default MinistryGroupList;
