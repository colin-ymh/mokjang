'use client';

import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { DESTRUCTIVE, GRAY } from '@/constants/styles/color';
import SideHeader from '@/components/atoms/layout/side/side-header';
import Button from '@/components/atoms/common/button/button';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';

import { useI18n } from '../../../../../locales/client';

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
    background-color: ${GRAY.SIDE_BAR};
    padding: 0 10px;
    border-right: 1px solid ${GRAY.LIGHT};
    overflow: hidden;
    flex-shrink: 0;
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
  onClickLogOut: () => void;
};

const SideView = ({ sideButtonList, onClickLogOut }: SideBarViewProps) => {
  const t = useI18n();

  return (
    <SideBarContainer>
      <SideHeader />
      <ButtonContainer>{sideButtonList}</ButtonContainer>
      <BottomContainer>
        <Button
          text={t('button.logOut')}
          onClick={onClickLogOut}
          height={30}
          backgroundColor={GRAY.LIGHT}
          color={DESTRUCTIVE.LIGHT}
        />
      </BottomContainer>
    </SideBarContainer>
  );
};

export default SideView;
