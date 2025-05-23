'use client';

import React from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';

import MainSideButton from '@/components/atoms/layout/side/main-side/main-side-button';
import { MAIN_HEADER_ID } from '@/constants/layout/header';
import GroupFilter from '@/components/atoms/layout/side/main-side/group-filter';

import { useScopedI18n } from '../../../../../../locales/client';

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-start;
  padding: 20px 15px;
`;

const GroupFilterContainer = styled.div<{ $isOpened: boolean }>`
  overflow-y: auto;
  margin: 10px 0;
  display: ${({ $isOpened }) => ($isOpened ? 'flex' : 'none')};
`;

type SideBarViewProps = {};

const MainSideButtonList = ({}: SideBarViewProps) => {
  const slug = useParams().slug as string[] | undefined;
  const headerId = slug?.[1] ?? null;

  const t_header = useScopedI18n('header');

  return (
    <ButtonContainer>
      <MainSideButton
        id={MAIN_HEADER_ID.HOME}
        title={t_header(MAIN_HEADER_ID.HOME)}
      />
      <MainSideButton
        id={MAIN_HEADER_ID.MEMBER}
        title={t_header(MAIN_HEADER_ID.MEMBER)}
      />
      <GroupFilterContainer $isOpened={headerId === MAIN_HEADER_ID.MEMBER}>
        <GroupFilter />
      </GroupFilterContainer>
      <MainSideButton
        id={MAIN_HEADER_ID.VISITATION}
        title={t_header(MAIN_HEADER_ID.VISITATION)}
      />
      <MainSideButton
        id={MAIN_HEADER_ID.EDUCATION}
        title={t_header(MAIN_HEADER_ID.EDUCATION)}
      />
      <MainSideButton
        id={MAIN_HEADER_ID.TASK}
        title={t_header(MAIN_HEADER_ID.TASK)}
      />
      <MainSideButton
        id={MAIN_HEADER_ID.CALENDAR}
        title={t_header(MAIN_HEADER_ID.CALENDAR)}
      />
    </ButtonContainer>
  );
};

export default MainSideButtonList;
