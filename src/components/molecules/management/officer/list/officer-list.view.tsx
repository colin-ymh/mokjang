import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { Officer } from '@/models/management/management';
import ManagementOfficerItem from '@/components/atoms/management/officer/list/management-officer-item';
import useWindowSize from '@/hooks/window/window';

const OfficerListContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  gap: 5px;
  height: ${({ height }) => `${height - 250}px`};
`;

type OfficerListViewProps = {
  list: {
    officers: Officer[];
  };
  toast: {
    setIsToastShown: Dispatch<SetStateAction<boolean>>;
    setToastText: Dispatch<SetStateAction<string>>;
    setToastColor: Dispatch<SetStateAction<string>>;
  };
  item: {
    selectedOfficerId: string | null;
    onClickOfficer: (id: string) => void;
  };
};

const OfficerListView = (props: OfficerListViewProps) => {
  const { height } = useWindowSize();
  const { officers } = props.list;
  const toastProps = props.toast;
  const itemProps = props.item;
  return (
    <>
      <OfficerListContainer height={height}>
        {officers.map((officer) => (
          <ManagementOfficerItem
            key={officer.id}
            level={0}
            officer={officer}
            {...itemProps}
            {...toastProps}
          />
        ))}
      </OfficerListContainer>
    </>
  );
};

export default OfficerListView;
