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
  padding: 20px 15px;
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
        id={MANAGEMENT_HEADER_ID.MANAGER}
        title={t_header(MANAGEMENT_HEADER_ID.MANAGER)}
      />
      <ManagementSideButton
        id={MANAGEMENT_HEADER_ID.PERMISSION}
        title={t_header(MANAGEMENT_HEADER_ID.PERMISSION)}
      />
      <ManagementSideButton
        id={MANAGEMENT_HEADER_ID.JOIN}
        title={t_header(MANAGEMENT_HEADER_ID.JOIN)}
      />
      <ManagementSideButton
        id={MANAGEMENT_HEADER_ID.USER}
        title={t_header(MANAGEMENT_HEADER_ID.USER)}
      />
      <ManagementSideButton
        id={MANAGEMENT_HEADER_ID.SETTING}
        title={t_header(MANAGEMENT_HEADER_ID.SETTING)}
      />
    </ButtonContainer>
  );
};

export default ManagementSideButtonList;
