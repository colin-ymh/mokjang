import React, { memo } from 'react';
import styled from 'styled-components';
import { Group } from '@/models/management/management';
import GroupHierarchyItem from '@/components/atoms/group/group-hierarchy-item';

const ChildGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const GroupHierarchyList = memo(
  ({
    groups,
    level,
    openGroups,
    selectedGroupId,
    onClickToggle,
    onClickGroup,
    t,
  }: {
    groups: Group[];
    level: number;
    openGroups: Record<number, boolean>;
    selectedGroupId: string | null;
    onClickToggle: (id: number) => void;
    onClickGroup: (groupId: string | null) => void;
    t: (key: string, ...args: any[]) => string;
  }) => {
    return (
      <>
        {groups.map((group) => {
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
