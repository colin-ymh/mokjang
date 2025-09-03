import React, { memo } from 'react';
import styled from 'styled-components';
import { MinistryGroup } from '@mokjang/models';
import { BLANK } from '@mokjang/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import MinistryGroupHierarchyItem from '../../atoms/ministry/ministry-hierarchy-item';

const ChildMinistryGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

type MinistryGroupHierarchyListProps = {
  isAllSelectable: boolean;
  isNullable: boolean;
  ministryGroups: MinistryGroup[];
  level: number;
  openMinistryGroups: Record<number, boolean>;
  selectedMinistryGroupId: string | null;
  onClickToggle: (id: number) => void;
  onClickMinistryGroup: (ministryGroupId: string | null) => void;
  t: (key: string, ...args: any[]) => string;
};

const MinistryGroupHierarchyList = memo(
  ({
    isAllSelectable,
    isNullable,
    ministryGroups,
    level,
    openMinistryGroups,
    selectedMinistryGroupId,
    onClickToggle,
    onClickMinistryGroup,
    t,
  }: MinistryGroupHierarchyListProps) => {
    const churchId = useSelector((state: RootState) => state.church.churchId);

    const nullMinistryGroup: MinistryGroup = {
      id: null, // 고유 ID (임의로 0으로 설정)
      name: BLANK,
      order: 0,
      parentMinistryGroupId: null,
      childMinistryGroups: [], // 모든 그룹을 하위 그룹으로 설정
      membersCount: 0,
      churchId,
      childMinistryGroupIds: [],
      leaderMemberId: BLANK,
    };

    const shownMinistryGroups = isNullable
      ? [nullMinistryGroup, ...ministryGroups]
      : ministryGroups;

    return (
      <>
        {shownMinistryGroups.map((ministryGroup) => {
          const ministryGroupIdNum = ministryGroup.id
            ? parseInt(ministryGroup.id as string)
            : -1;
          const isOpen = openMinistryGroups[ministryGroupIdNum] ?? false;
          const isSelected =
            (ministryGroup.id as string) === selectedMinistryGroupId;

          return (
            <ChildMinistryGroupsContainer key={ministryGroupIdNum}>
              <MinistryGroupHierarchyItem
                isAllSelectable={isAllSelectable}
                ministryGroup={ministryGroup}
                level={level}
                isOpen={isOpen}
                isSelected={isSelected}
                onClickToggle={onClickToggle}
                onClickMinistryGroup={onClickMinistryGroup}
                t={t}
              />
              {isOpen &&
                ministryGroup.childMinistryGroups &&
                ministryGroup.childMinistryGroups.length > 0 && (
                  <MinistryGroupHierarchyList
                    isAllSelectable={isAllSelectable}
                    isNullable={isNullable}
                    ministryGroups={ministryGroup.childMinistryGroups}
                    level={level + 1}
                    openMinistryGroups={openMinistryGroups}
                    selectedMinistryGroupId={selectedMinistryGroupId}
                    onClickToggle={onClickToggle}
                    onClickMinistryGroup={onClickMinistryGroup}
                    t={t}
                  />
                )}
            </ChildMinistryGroupsContainer>
          );
        })}
      </>
    );
  }
);

MinistryGroupHierarchyList.displayName = 'MinistryGroupHierarchyList';

export default memo(MinistryGroupHierarchyList);
