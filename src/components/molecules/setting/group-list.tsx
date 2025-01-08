import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GroupsApi } from '@/api/settings/groups.api';
import { Group } from '@/models/setting/group';
import GroupListView from '@/components/molecules/setting/group-list.view';
import { getOrderedGroups } from '@/utils/group';

import { useI18n } from '../../../../locales/client';

type GroupListProps = {
  selectedGroupId: string | null;
  setSelectedGroup: Dispatch<SetStateAction<Group>>;
};

const GroupList = ({ selectedGroupId, setSelectedGroup }: GroupListProps) => {
  const t = useI18n();
  const groupsApi = new GroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 전체 그룹 배열
  const [groups, setGroups] = useState<Group[]>([]);

  // 닫혀있는 그룹들
  const [closedGroups, setClosedGroups] = useState<Set<number>>(new Set());

  // 그룹 불러오기
  const fetchGroups = () => {
    groupsApi.getGroups({ churchId }).then((response) => {
      if (response.status === 200) {
        const orderedGroups = getOrderedGroups(response.data);

        // 최상단에 "전체" 그룹을 추가
        const allGroup: Group = {
          id: null, // 고유 ID (임의로 0으로 설정)
          name: t('all'),
          parentGroupId: null,
          childGroups: orderedGroups, // 모든 그룹을 하위 그룹으로 설정
          membersCount: 0,
          churchId,
          childGroupIds: [],
          members: [],
        };

        setGroups([allGroup]);
      }
    });
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
      fetchGroups();
    }
  }, [churchId]);

  const props = {
    groups,
    closedGroups,
    selectedGroupId,
    setSelectedGroup,
    fetchGroups,
    onClickToggle,
  };
  return (
    <>
      <GroupListView {...props} />
    </>
  );
};

export default GroupList;
