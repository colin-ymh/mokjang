import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { Group } from '@/models/management/management';
import GroupListView from '@/components/molecules/management/group/group-list.view';

import { useI18n } from '../../../../../locales/client';
import { getOrderedGroups } from '@/utils/group';

type GroupListProps = {
  selectedGroupId: string | null;
  setSelectedGroup: Dispatch<SetStateAction<Group>>;
};

const GroupList = ({ selectedGroupId, setSelectedGroup }: GroupListProps) => {
  const t = useI18n();
  const { churchId, groups } = useSelector((state: RootState) => state.church);

  // 전체 그룹 배열
  const [orderedGroups, setOrderedGroups] = useState<Group[]>([]);

  // 닫혀있는 그룹들
  const [closedGroups, setClosedGroups] = useState<Set<number>>(new Set());

  // 그룹 불러오기
  const fetchOrderedGroups = () => {
    // 최상단에 "전체" 그룹을 추가
    const allGroup: Group = {
      id: null, // 고유 ID (임의로 0으로 설정)
      name: t('all'),
      parentGroupId: null,
      childGroups: getOrderedGroups(groups), // 모든 그룹을 하위 그룹으로 설정
      membersCount: 0,
      churchId,
      childGroupIds: [],
      roles: [],
    };

    setOrderedGroups([allGroup]);
  };

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

  // 교회 정보를 통해 소그룹들 불러오기
  useEffect(() => {
    if (churchId) {
      fetchOrderedGroups();
    }
  }, [churchId, groups]);

  const props = {
    groups: orderedGroups,
    closedGroups,
    selectedGroupId,
    setSelectedGroup,
    onClickToggle,
  };
  return (
    <>
      <GroupListView {...props} />
    </>
  );
};

export default GroupList;
