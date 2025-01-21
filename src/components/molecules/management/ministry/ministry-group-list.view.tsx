import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { MinistryGroup } from '@/models/management/management';
import ManagementMinistryGroupItem from '@/components/atoms/management/ministry/management-ministry-group-item';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
`;

type MinistryGroupListViewProps = {
  ministryGroups: MinistryGroup[];
  closedMinistryGroups: Set<number>;
  selectedMinistryGroupId: string | null;
  setSelectedMinistryGroup: Dispatch<SetStateAction<MinistryGroup>>;
  fetchMinistryGroups: () => void;
  onClickToggle: (id: string) => void;
};

const MinistryMinistryGroupListView = ({
  ministryGroups,
  closedMinistryGroups,
  selectedMinistryGroupId,
  setSelectedMinistryGroup,
  fetchMinistryGroups,
  onClickToggle,
}: MinistryGroupListViewProps) => {
  return (
    <FilterContainer>
      {ministryGroups.map((ministryGroup) => (
        <ManagementMinistryGroupItem
          key={ministryGroup.id}
          ministryGroup={ministryGroup}
          level={0}
          selectedMinistryGroupId={selectedMinistryGroupId}
          setSelectedMinistryGroup={setSelectedMinistryGroup}
          closedMinistryGroups={closedMinistryGroups}
          fetchMinistryGroups={fetchMinistryGroups}
          onClickToggle={onClickToggle}
        />
      ))}
    </FilterContainer>
  );
};

export default MinistryMinistryGroupListView;
