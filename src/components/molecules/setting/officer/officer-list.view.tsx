import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { Officer } from '@/models/setting/setting';
import SettingOfficerItem from '@/components/atoms/setting/officer/setting-officer-item';

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
  fetchOfficers: () => void;
};

const OfficerListView = ({
  officers,
  selectedOfficerId,
  setSelectedOfficer,
  fetchOfficers,
}: OfficerListViewProps) => {
  return (
    <FilterContainer>
      {officers.map((officer) => (
        <SettingOfficerItem
          key={officer.id}
          officer={officer}
          selectedOfficerId={selectedOfficerId}
          setSelectedOfficer={setSelectedOfficer}
          fetchOfficers={fetchOfficers}
        />
      ))}
    </FilterContainer>
  );
};

export default OfficerListView;
