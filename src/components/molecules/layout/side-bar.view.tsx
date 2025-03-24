'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { ErrorApi } from '@/api/error/error.api';
import { BLACK, DESTRUCTIVE, GRAY, WHITE } from '@/constants/styles/color';
import SideBarButton from '@/components/atoms/layout/side-bar/side-bar-button';
import SideBarHeader from '@/components/atoms/layout/side-bar/side-bar-header';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import { HEADER_ID } from '@/constants/layout/header';
import GroupFilter from '@/components/molecules/layout/group-filter';
import Button from '@/components/atoms/common/button/button';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';

import { useI18n, useScopedI18n } from '../../../../locales/client';
import Loading from '@/components/atoms/common/etc/loading';

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

const TextContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 5px;
  padding-bottom: 10px;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  padding-bottom: 10px;
  flex-direction: column;
  gap: 10px;
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
  const [isLoading, setIsLoading] = useState(false);
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
      <TextContainer>
        <MainText fontWeight={600} color={GRAY.DEFAULT}>
          {'TEL'}
        </MainText>
        <MainText size={SIZE.MEDIUM} color={GRAY.DEFAULT}>
          {'나천호 010-9909-6581'}
        </MainText>
        <MainText size={SIZE.MEDIUM} color={GRAY.DEFAULT}>
          {'유민혁 010-5696-6896'}
        </MainText>
        <MainText size={SIZE.MEDIUM} color={GRAY.DEFAULT}>
          {'김홍남 010-5024-4636'}
        </MainText>
      </TextContainer>
      <Loading isShow={isLoading} />
      <BottomContainer>
        <Button
          text={'로딩 테스트'}
          height={30}
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 3000);
          }}
        />
        <Button
          text={'설문조사 진행하기'}
          onClick={() =>
            window.open(
              'https://docs.google.com/forms/d/1e58wUrCS3sWSmE-3wKVxtVNNEcrnwGBXNuflUiZ1cUk/viewform?edit_requested=true',
              '_blank'
            )
          }
          height={30}
          // width={80}
          backgroundColor={BLACK}
          color={WHITE}
        />
        <Button
          text={t('button.logOut')}
          onClick={onClickLogOut}
          height={30}
          // width={80}
          backgroundColor={GRAY.LIGHT}
          color={DESTRUCTIVE.LIGHT}
        />
        {/*<Button*/}
        {/*  text={'에러 테스트'}*/}
        {/*  onClick={async () => {*/}
        {/*    try {*/}
        {/*      await errorApi.getError({});*/}
        {/*    } catch (error) {*/}
        {/*      setThrownError(*/}
        {/*        error instanceof Error ? error : new Error(String(error))*/}
        {/*      );*/}
        {/*    }*/}
        {/*  }}*/}
        {/*  height={30}*/}
        {/*  // width={80}*/}
        {/*  backgroundColor={BLACK}*/}
        {/*  color={WHITE}*/}
        {/*/>*/}
      </BottomContainer>
    </SideBarContainer>
  );
};

export default SideBarView;
