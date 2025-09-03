'use client';

import React from 'react';
import styled from 'styled-components';
import { useManagementSideBarItems } from '../../../../../hooks/layout/side-bar-items';
import SideButton from '../../../../atoms/layout/side/side-button';

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-start;
  padding: 20px 15px;
  gap: 10px;
`;

type SideBarViewProps = {};

const ManagementSideButtonList = ({}: SideBarViewProps) => {
  const buttonList = useManagementSideBarItems();

  return (
    <ButtonContainer>
      {buttonList.map((button) => (
        <SideButton key={button.id} {...button} />
      ))}
    </ButtonContainer>
  );
};

export default ManagementSideButtonList;
