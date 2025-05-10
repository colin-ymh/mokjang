import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { MinistryGroup } from '@/models/management/management';
import ManagementMinistryGroupItem from '@/components/atoms/management/ministry/management-ministry-group-item';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
`;

type MinistryGroupListViewProps = {
  closedMinistryGroups: Set<number>;
  selectedMinistryGroupId: string | null;
  setSelectedMinistryGroup: Dispatch<SetStateAction<MinistryGroup>>;
  onClickToggle: (id: string) => void;
};

const MinistryMinistryGroupListView = ({
  closedMinistryGroups,
  selectedMinistryGroupId,
  setSelectedMinistryGroup,
  onClickToggle,
}: MinistryGroupListViewProps) => {
  const { ministryGroups } = useSelector((state: RootState) => state.church);
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
          onClickToggle={onClickToggle}
        />
      ))}
    </FilterContainer>
  );
};

export default MinistryMinistryGroupListView;
