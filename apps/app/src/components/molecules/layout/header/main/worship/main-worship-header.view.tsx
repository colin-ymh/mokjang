import React from 'react';
import styled from 'styled-components';

import { GRAY, MAIN, MEDIA_MIN_WIDTH, SIZE } from '@mokjang/constants';
import { Button, CustomPopup, MainText } from '@mokjang/components';
import { useScopedI18n } from '../../../../../../../locales/client';
import { MAIN_HEADER_ID } from '@/constants/layout/header';
import AddWorship from '../../../../../organisms/worship/add/add-worship';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    height: 40px;
    padding: 0 20px;
    justify-content: center;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    height: 120px;
    justify-content: space-between;
    padding: 0;
    border-bottom: 0.7px solid ${GRAY.LIGHT};
  }
`;

const HeaderTopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0 20px;
`;

const TitleContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: row;
`;

const HeaderBottomContainer = styled.div`
  display: none;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
`;

type MainWorshipHeaderViewProps = {
  isAddWorshipOpened: boolean;
  isSaveEnabled: boolean;
  onClickAddWorship: () => void;
  onClickCloseModal: () => void;
  onClickSaveWorship: () => void;
};

const MainWorshipHeaderView = ({
  isAddWorshipOpened,
  isSaveEnabled,
  onClickAddWorship,
  onClickCloseModal,
  onClickSaveWorship,
}: MainWorshipHeaderViewProps) => {
  const t_header = useScopedI18n('header');
  const t_title = useScopedI18n('title');
  const t_button = useScopedI18n('button');

  return (
    <HeaderContainer>
      <HeaderTopContainer>
        <TitleContainer>
          <MainText size={SIZE.EXTRA_LARGE} fontSize={24}>
            {t_header(MAIN_HEADER_ID.WORSHIP)}
          </MainText>
        </TitleContainer>
        <Button
          text={t_button('addWorship')}
          onClick={onClickAddWorship}
          width={100}
          height={30}
        />
      </HeaderTopContainer>
      <HeaderBottomContainer></HeaderBottomContainer>
      {/* 예배 추가 */}
      <CustomPopup
        isShow={isAddWorshipOpened}
        onClickCancel={onClickCloseModal}
        headerTitle={t_title('addWorship')}
        width={500}
        height={500}
        onClickDone={onClickSaveWorship}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSaveEnabled}
        cancelText={t_button('cancel')}
        doneText={t_button('save')}
      >
        <AddWorship />
      </CustomPopup>
    </HeaderContainer>
  );
};

export default MainWorshipHeaderView;
