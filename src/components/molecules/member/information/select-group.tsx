import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { DEFAULT_GROUP, Group } from '@/models/management/management';

import { GroupsApi } from '@/api/management/group/groups.api';
import { getOrderedGroups } from '@/utils/group';
import { useI18n } from '../../../../../locales/client';
import SelectGroupView from '@/components/molecules/member/information/select-group.view';

type SelectGroupModalProps = {
  value: string | null;
  onClickSave: (group: Group) => void;
  onClickClose: () => void;
};

const SelectGroup = ({
  value,
  onClickSave,
  onClickClose,
}: SelectGroupModalProps) => {
  const t = useI18n();
  const groupsApi = new GroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const START_GROUP: Group = {
    id: null,
    name: t('all'),
    parentGroupId: null,
    childGroups: [],
    membersCount: 0,
    churchId,
    childGroupIds: [],
    roles: [],
  };

  // 전체 그룹
  const [allGroups, setAllGroups] = useState<Group[]>([]);

  // 현재 선택된 그룹
  const [selectedGroup, setSelectedGroup] = useState<Group>(DEFAULT_GROUP);

  // 현재 보고있는 그룹
  const [currentGroup, setCurrentGroup] = useState<Group>(START_GROUP);

  // 보고있는 그룹 배열
  const [groups, setGroups] = useState<Group[]>([]);

  // 부모 계층 배열
  const [parentGroups, setParentGroups] = useState<Group[]>([]);

  const groupList =
    currentGroup !== selectedGroup
      ? [...parentGroups, currentGroup, selectedGroup]
      : [...parentGroups, currentGroup];

  // 뒤로 가기 (부모 그룹으로 올라가기)
  const onClickGoBack = () => {
    if (parentGroups.length > 0) {
      const lastGroups = parentGroups[parentGroups.length - 1];

      setGroups(lastGroups.childGroups as Group[]);
      setCurrentGroup(lastGroups);

      // 부모 계층에서 해당 부모 삭제
      setParentGroups(parentGroups.slice(0, -1));
    }
  };

  // 특정 그룹 찾기 (재귀적으로 검색)
  const getGroup = (groupId: string | null, groups: Group[]): Group | null => {
    for (const group of groups) {
      if (group.id === groupId) {
        return group; // 그룹 찾으면 즉시 반환
      }
      if (group.childGroups && group.childGroups.length > 0) {
        const foundGroup = getGroup(groupId, group.childGroups);
        if (foundGroup) return foundGroup;
      }
    }
    return null; // 찾지 못하면 null 반환
  };

  const findGroup = (groupId: string | null, groups: Group[]): Group | null => {
    for (const group of groups) {
      if (group.id === groupId) {
        return group; // 찾으면 반환
      }
      if (group.childGroups && group.childGroups.length > 0) {
        const foundGroup = findGroup(groupId, group.childGroups);
        if (foundGroup) return foundGroup;
      }
    }
    return null; // 못 찾으면 null 반환
  };

  // 부모그룹 선택 시, 자식 그룹으로 변환
  const onClickParent = (group: Group) => {
    setSelectedGroup(group);
    if (group.childGroupIds.length > 0 && group.childGroups) {
      setGroups(group.childGroups);
      setCurrentGroup(group);
      setParentGroups([
        ...parentGroups,
        getGroup(group.parentGroupId, allGroups) as Group,
      ]);
    }
  };

  const onClose = () => {
    onClickClose();
    setParentGroups([]);
    setCurrentGroup(START_GROUP);
    setAllGroups([]);
    fetchGroups();
  };

  // 전체 그룹 불러오기
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
          roles: [],
        };

        setAllGroups([allGroup]);
        setGroups(orderedGroups);
      }
    });
  };

  useEffect(() => {
    if (value) {
      const newSelectedGroup = findGroup(value, allGroups);
      if (newSelectedGroup) {
        setSelectedGroup(newSelectedGroup);
      }
    } else {
      setSelectedGroup(DEFAULT_GROUP);
    }
  }, [value, allGroups]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const props = {
    selectedGroup,
    groups,
    groupList,
    parentGroups,
    onClickGoBack,
    onClose,
    onClickParent,
    onClickSave,
  };

  return (
    <>
      <SelectGroupView {...props} />
    </>
  );
};

export default SelectGroup;
