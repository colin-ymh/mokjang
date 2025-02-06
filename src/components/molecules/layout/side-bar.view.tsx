'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY } from '@/constants/styles/color';
import SideBarButton from '@/components/atoms/layout/side-bar/side-bar-button';
import SideBarHeader from '@/components/atoms/layout/side-bar/side-bar-header';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import { HEADER_ID } from '@/constants/layout/header';
import GroupFilter from '@/components/molecules/layout/group-filter';

import { useI18n, useScopedI18n } from '../../../../locales/client';
import Button from '@/components/atoms/common/button/button';
import { ErrorApi } from '@/api/error/error.api';

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
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-start;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  padding: 10px;
`;

const GroupFilterContainer = styled.div<{ $isOpened: boolean }>`
  overflow-y: auto;
  margin: 10px 0;
  display: ${({ $isOpened }) => ($isOpened ? 'flex' : 'none')};
`;

type SideBarViewProps = {
  onClickLogOut: () => void;
};

const SideBarView = ({ onClickLogOut }: SideBarViewProps) => {
  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const errorApi = new ErrorApi(false);
  const t = useI18n();
  const t_header = useScopedI18n('header');
  const headerId = useSelector((state: RootState) => state.layout.headerId);

  return (
    <SideBarContainer>
      <SideBarHeader />
      <ButtonContainer>
        <SideBarButton id={HEADER_ID.HOME} title={t_header(HEADER_ID.HOME)} />
        <SideBarButton
          id={HEADER_ID.MEMBER}
          title={t_header(HEADER_ID.MEMBER)}
        />
        <GroupFilterContainer $isOpened={headerId === HEADER_ID.MEMBER}>
          <GroupFilter />
        </GroupFilterContainer>
        <SideBarButton
          id={HEADER_ID.MANAGEMENT}
          title={t(HEADER_ID.MANAGEMENT)}
        />
      </ButtonContainer>
      <BottomContainer>
        <Button
          text={t('button.logOut')}
          onClick={onClickLogOut}
          height={30}
          width={80}
          backgroundColor={GRAY.DEFAULT}
        />
      </BottomContainer>
    </SideBarContainer>
  );
};

export default SideBarView;
