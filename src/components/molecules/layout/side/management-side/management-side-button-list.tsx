'use client';

import React from 'react';
import styled from 'styled-components';

import { MANAGEMENT_HEADER_ID } from '@/constants/layout/header';
import ManagementSideButton from '@/components/atoms/layout/side/management-side/management-side-button';

import { useScopedI18n } from '../../../../../../locales/client';

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-start;
`;

type SideBarViewProps = {};

const ManagementSideButtonList = ({}: SideBarViewProps) => {
  const t_header = useScopedI18n('header');

  return (
    <ButtonContainer>
      <ManagementSideButton
        id={MANAGEMENT_HEADER_ID.CHURCH}
        title={t_header(MANAGEMENT_HEADER_ID.CHURCH)}
      />
      <ManagementSideButton
        id={MANAGEMENT_HEADER_ID.ADMINISTRATOR}
        title={t_header(MANAGEMENT_HEADER_ID.ADMINISTRATOR)}
      />
      <ManagementSideButton
        id={MANAGEMENT_HEADER_ID.SETTING}
        title={t_header(MANAGEMENT_HEADER_ID.SETTING)}
      />
    </ButtonContainer>
  );
};

export default ManagementSideButtonList;
