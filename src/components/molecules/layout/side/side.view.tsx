'use client';

import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';

const SideBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    display: none;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.TABLET}) {
    display: none;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    width: 180px;
    background-color: ${WHITE};
    border-right: 0.7px solid ${GRAY.SEMI_LIGHT};
    overflow: hidden;
    position: relative;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  padding-bottom: 10px;
  flex-direction: column;
  gap: 10px;
`;

type SideBarViewProps = {
  sideButtonList: ReactNode;
  // onClickLogOut: () => void;
};

const SideView = ({ sideButtonList }: SideBarViewProps) => {
  return (
    <SideBarContainer>
      {/*<SideHeader />*/}
      <ButtonContainer>{sideButtonList}</ButtonContainer>
    </SideBarContainer>
  );
};

export default SideView;
