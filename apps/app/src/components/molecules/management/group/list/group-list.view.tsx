import React from 'react';
import styled from 'styled-components';

import { Group } from '@mokjang/models';
import ManagementGroupItem from '../../../../atoms/management/group/list/management-group-item';
import useWindowSize from '../../../../../hooks/window/window';

const GroupListContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  height: ${({ height }) => `${height - 330}px`};
`;

type GroupListViewProps = {
  groups: Group[];
  closedGroups: Set<number>;
  selectedGroupId: string | null;
  onClickGroup: (group: Group) => void;
  onClickToggle: (id: string) => void;
};

const GroupListView = ({
  groups,
  closedGroups,
  selectedGroupId,
  onClickGroup,
  onClickToggle,
}: GroupListViewProps) => {
  const { height } = useWindowSize();
  return (
    <>
      <GroupListContainer height={height}>
        {groups.map((group) => (
          <ManagementGroupItem
            key={group.id}
            level={0}
            group={group}
            closedGroups={closedGroups}
            selectedGroupId={selectedGroupId}
            onClickGroup={onClickGroup}
            onClickToggle={onClickToggle}
          />
        ))}
      </GroupListContainer>
    </>
  );
};

export default GroupListView;
