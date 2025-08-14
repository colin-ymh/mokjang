import React, { memo } from 'react';
import styled from 'styled-components';
import { Group } from '@/models/management/management';
import GroupHierarchyItem from '@/components/atoms/group/group-hierarchy-item';
import { BLANK } from '@/constants/constant';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const ChildGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

type GroupHierarchyListProps = {
  isAllSelectable: boolean;
  isNullable: boolean;
  groups: Group[];
  level: number;
  openGroups: Record<number, boolean>;
  selectedGroupId: string | null;
  onClickToggle: (id: number) => void;
  onClickGroup: (groupId: string | null) => void;
  t: (key: string, ...args: any[]) => string;
};

const GroupHierarchyList = memo(
  ({
    isAllSelectable,
    isNullable,
    groups,
    level,
    openGroups,
    selectedGroupId,
    onClickToggle,
    onClickGroup,
    t,
  }: GroupHierarchyListProps) => {
    const churchId = useSelector((state: RootState) => state.church.churchId);

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

    const shownGroups = isNullable ? [nullGroup, ...groups] : groups;

    return (
      <>
        {shownGroups.map((group) => {
          const groupIdNum = parseInt(group.id as string);
          const isOpen = openGroups[groupIdNum] ?? false;
          const isSelected = (group.id as string) === selectedGroupId;

          return (
            <ChildGroupsContainer key={groupIdNum}>
              <GroupHierarchyItem
                group={group}
                level={level}
                isOpen={isOpen}
                isSelected={isSelected}
                onClickToggle={onClickToggle}
                onClickGroup={onClickGroup}
                t={t}
              />
              {isOpen && group.childGroups && group.childGroups.length > 0 && (
                <GroupHierarchyList
                  isAllSelectable={isAllSelectable}
                  isNullable={isNullable}
                  groups={group.childGroups}
                  level={level + 1}
                  openGroups={openGroups}
                  selectedGroupId={selectedGroupId}
                  onClickToggle={onClickToggle}
                  onClickGroup={onClickGroup}
                  t={t}
                />
              )}
            </ChildGroupsContainer>
          );
        })}
      </>
    );
  }
);

GroupHierarchyList.displayName = 'GroupHierarchyList';

export default memo(GroupHierarchyList);
