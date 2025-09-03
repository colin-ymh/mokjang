import React from 'react';
import styled from 'styled-components';

import { Officer } from '../../../../../models/management/management';
import ManagementOfficerItem from '../../../../atoms/management/officer/list/management-officer-item';
import useWindowSize from '../../../../../hooks/window/window';

const OfficerListContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  gap: 5px;
  height: ${({ height }) => `${height - 250}px`};
`;

type OfficerListViewProps = {
  officers: Officer[];
  selectedOfficerId: string | null;
  onClickOfficer: (officer: Officer) => void;
};

const OfficerListView = ({
  officers,
  selectedOfficerId,
  onClickOfficer,
}: OfficerListViewProps) => {
  const { height } = useWindowSize();
  return (
    <>
      <OfficerListContainer height={height}>
        {officers.map((officer) => (
          <ManagementOfficerItem
            key={officer.id}
            level={0}
            officer={officer}
            selectedOfficerId={selectedOfficerId}
            onClickOfficer={onClickOfficer}
          />
        ))}
      </OfficerListContainer>
    </>
  );
};

export default OfficerListView;
