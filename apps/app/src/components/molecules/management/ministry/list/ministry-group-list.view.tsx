import React from 'react';
import styled from 'styled-components';

import { MinistryGroup } from '@mokjang/models';
import ManagementMinistryGroupItem from '../../../../atoms/management/ministry/list/management-ministry-group-item';

const MinistryGroupListContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  height: ${({ height }) => `${height}px`};
`;

type MinistryGroupListViewProps = {
  ministryGroups: MinistryGroup[];
  closedMinistryGroups: Set<number>;
  selectedMinistryGroupId: string | null;
  onClickMinistryGroup: (group: MinistryGroup) => void;
  onClickToggle: (id: string) => void;
  height: number;
};

const MinistryGroupListView = ({
  ministryGroups,
  closedMinistryGroups,
  selectedMinistryGroupId,
  onClickMinistryGroup,
  onClickToggle,
  height,
}: MinistryGroupListViewProps) => {
  return (
    <>
      <MinistryGroupListContainer height={height}>
        {ministryGroups.map((ministryGroup) => (
          <ManagementMinistryGroupItem
            key={ministryGroup.id}
            level={0}
            ministryGroup={ministryGroup}
            closedMinistryGroups={closedMinistryGroups}
            selectedMinistryGroupId={selectedMinistryGroupId}
            onClickMinistryGroup={onClickMinistryGroup}
            onClickToggle={onClickToggle}
          />
        ))}
      </MinistryGroupListContainer>
    </>
  );
};

export default MinistryGroupListView;
