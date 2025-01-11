import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { Group } from '@/models/management/management';
import ManagementGroupItem from '@/components/atoms/management/group/management-group-item';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
`;

type GroupListViewProps = {
  groups: Group[];
  closedGroups: Set<number>;
  selectedGroupId: string | null;
  setSelectedGroup: Dispatch<SetStateAction<Group>>;
  fetchGroups: () => void;
  onClickToggle: (id: string) => void;
};

const GroupListView = ({
  groups,
  closedGroups,
  selectedGroupId,
  setSelectedGroup,
  fetchGroups,
  onClickToggle,
}: GroupListViewProps) => {
  return (
    <FilterContainer>
      {groups.map((group) => (
        <ManagementGroupItem
          key={group.id}
          group={group}
          level={0}
          selectedGroupId={selectedGroupId}
          setSelectedGroup={setSelectedGroup}
          closedGroups={closedGroups}
          fetchGroups={fetchGroups}
          onClickToggle={onClickToggle}
        />
      ))}
    </FilterContainer>
  );
};

export default GroupListView;
