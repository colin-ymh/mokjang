import React, { memo } from 'react';
import styled from 'styled-components';
import { Group } from '../../../models/management/management';
import GroupHierarchyItem from '../../atoms/group/group-hierarchy-item';

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
    return (
      <>
        {groups.map((group) => {
          const groupIdNum = group.id ? parseInt(group.id as string) : -1;
          const isOpen = openGroups[groupIdNum] ?? false;
          const isSelected = (group.id as string) === selectedGroupId;

          return (
            <ChildGroupsContainer key={groupIdNum}>
              <GroupHierarchyItem
                isAllSelectable={isAllSelectable}
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
