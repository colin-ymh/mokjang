import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Group } from '@mokjang/models';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useI18n } from '../../../../locales/client';
import GroupHierarchyList from '../../molecules/group/group-hierarchy-list';
import { BLANK } from '@mokjang/constants';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

type GroupFilterViewProps = {
  isAllSelectable: boolean;
  isNullable: boolean;
  isDefaultOpen: boolean;
  topLevelGroupId?: string | null;
  selectedGroupId: string | null;
  onClickGroup: (groupId: string | null) => void;
};

// 헬퍼 함수들을 컴포넌트 외부에서 정의
const findGroupById = (groups: Group[], targetId: string): Group | null => {
  for (const group of groups) {
    if (group.id === targetId) {
      return group;
    }
    if (group.childGroups && group.childGroups.length > 0) {
      const found = findGroupById(group.childGroups, targetId);
      if (found) return found;
    }
  }
  return null;
};

const getAllGroupIds = (
  groups: Group[],
  topLevelGroupId?: string | null
): number[] => {
  let ids: number[] = [];

  if (topLevelGroupId) {
    const topGroup = findGroupById(groups, topLevelGroupId);
    if (topGroup) {
      ids.push(parseInt(topGroup.id as string));
      if (topGroup.childGroups?.length) {
        ids = ids.concat(getAllGroupIds(topGroup.childGroups));
      }
    }
  } else {
    ids = [NaN];
    groups.forEach((group) => {
      if (group.id !== null) ids.push(parseInt(group.id as string));
      if (group.childGroups?.length) {
        ids = ids.concat(getAllGroupIds(group.childGroups));
      }
    });
  }

  return ids;
};

const getInitialOpenGroups = (
  groups: Group[],
  isDefaultOpen: boolean,
  topLevelGroupId?: string | null
): Record<number, boolean> => {
  if (isDefaultOpen) {
    const allGroupIds = getAllGroupIds(groups, topLevelGroupId);
    return Object.fromEntries(allGroupIds.map((id) => [id, true]));
  } else {
    if (topLevelGroupId) {
      const topGroup = findGroupById(groups, topLevelGroupId);
      if (topGroup) {
        return { [parseInt(topGroup.id as string)]: true };
      }
    }
    return { [NaN]: true };
  }
};

const SelectGroupHierarchyView = memo(
  ({
    isAllSelectable,
    isNullable,
    isDefaultOpen,
    topLevelGroupId,
    selectedGroupId,
    onClickGroup,
  }: GroupFilterViewProps) => {
    const t = useI18n();
    const { groups, churchId } = useSelector(
      (state: RootState) => state.church
    );

    // 초기 상태를 useState의 lazy initialization으로 설정
    const [openGroups, setOpenGroups] = useState<Record<number, boolean>>(() =>
      getInitialOpenGroups(groups, isDefaultOpen, topLevelGroupId)
    );

    const nullGroup: Group = {
      id: null, // 고유 ID (임의로 0으로 설정)
      name: BLANK,
      order: 0,
      parentGroupId: null,
      childGroups: [], // 모든 그룹을 하위 그룹으로 설정
      membersCount: 0,
      churchId,
      childGroupIds: [],
      leaderMemberId: BLANK,
    };

    // props나 groups가 변경될 때만 상태 업데이트
    useEffect(() => {
      const newOpenGroups = getInitialOpenGroups(
        groups,
        isDefaultOpen,
        topLevelGroupId
      );
      setOpenGroups(newOpenGroups);
    }, [groups, isDefaultOpen, topLevelGroupId]);

    const onClickToggle = useCallback((id: number) => {
      setOpenGroups((prevState) => ({
        ...prevState,
        [id]: !(prevState[id] ?? false),
      }));
    }, []);

    const groupsToRender = useMemo(() => {
      if (!topLevelGroupId) {
        return isNullable ? [nullGroup, ...groups] : [...groups];
      }

      const topLevelGroup = findGroupById(groups, topLevelGroupId);
      if (topLevelGroup) {
        return isNullable ? [nullGroup, topLevelGroup] : [topLevelGroup];
      }
      return isNullable ? [nullGroup, ...groups] : [...groups];
    }, [groups, topLevelGroupId, isNullable]);

    return (
      <FilterContainer>
        <GroupHierarchyList
          isAllSelectable={isAllSelectable}
          isNullable={isNullable}
          groups={groupsToRender}
          level={0}
          openGroups={openGroups}
          selectedGroupId={selectedGroupId}
          onClickToggle={onClickToggle}
          onClickGroup={onClickGroup}
          t={t}
        />
      </FilterContainer>
    );
  }
);

export default SelectGroupHierarchyView;
