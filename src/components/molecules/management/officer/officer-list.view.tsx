import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { Officer } from '@/models/management/management';
import ManagementOfficerItem from '@/components/atoms/management/officer/management-officer-item';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
`;

type OfficerListViewProps = {
  officers: Officer[];
  selectedOfficerId: string | null;
  setSelectedOfficer: Dispatch<SetStateAction<Officer>>;
};

const OfficerListView = ({
  officers,
  selectedOfficerId,
  setSelectedOfficer,
}: OfficerListViewProps) => {
  return (
    <FilterContainer>
      {officers.map((officer) => (
        <ManagementOfficerItem
          key={officer.id}
          officer={officer}
          selectedOfficerId={selectedOfficerId}
          setSelectedOfficer={setSelectedOfficer}
        />
      ))}
    </FilterContainer>
  );
};

export default OfficerListView;
