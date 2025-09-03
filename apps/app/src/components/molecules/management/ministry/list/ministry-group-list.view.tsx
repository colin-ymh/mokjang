import React from 'react';
import styled from 'styled-components';

import { MinistryGroup } from '../../../../../models/management/management';
import useWindowSize from '../../../../../hooks/window/window';
import ManagementMinistryGroupItem from '../../../../atoms/management/ministry/list/management-ministry-group-item';

const MinistryGroupListContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  height: ${({ height }) => `${height - 250}px`};
`;

type MinistryGroupListViewProps = {
  ministryGroups: MinistryGroup[];
  closedMinistryGroups: Set<number>;
  selectedMinistryGroupId: string | null;
  onClickMinistryGroup: (group: MinistryGroup) => void;
  onClickToggle: (id: string) => void;
};

const MinistryGroupListView = ({
  ministryGroups,
  closedMinistryGroups,
  selectedMinistryGroupId,
  onClickMinistryGroup,
  onClickToggle,
}: MinistryGroupListViewProps) => {
  const { height } = useWindowSize();
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
