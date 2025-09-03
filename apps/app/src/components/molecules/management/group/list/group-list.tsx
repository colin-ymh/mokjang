import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';

import { Group } from '@mokjang/models';
import GroupListView from './group-list.view';

type GroupListProps = {
  selectedGroupId: string | null;
  onClickGroup: (group: Group) => void;
};

const GroupList = ({ selectedGroupId, onClickGroup }: GroupListProps) => {
  const { groups } = useSelector((state: RootState) => state.church);

  // 닫혀있는 그룹들
  const [closedGroups, setClosedGroups] = useState<Set<number>>(new Set());

  // 그룹 열고 닫기
  const onClickToggle = (id: string) => {
    const ID = parseInt(id);

    setClosedGroups((prevClosedGroups) => {
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
    groups,
    closedGroups,
    selectedGroupId,
    onClickGroup,
    onClickToggle,
  };

  return (
    <>
      <GroupListView {...props} />
    </>
  );
};

export default GroupList;
