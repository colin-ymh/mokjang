import React from 'react';
import styled from 'styled-components';

import { BLACK, GRAY, MAIN } from '@mokjang/constants';
import { MainText } from '@mokjang/components';
import { SIZE } from '@mokjang/constants';

import { useScopedI18n } from '../../../../../../../locales/client';

import { MEDIA_MIN_WIDTH } from '@mokjang/constants';
import { Button } from '@mokjang/components';
import AddEducation from '../../../../../organisms/education/education/add/add-education';

import { Svg } from '@mokjang/assets';
import { MAIN_HEADER_ID } from '@/constants/layout/header';
import WrappedPagePopup from '../../../../../atoms/common/popup/wrapped-page-popup';

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

const GoBackButton = styled(Svg.ChevronLeft)`
  width: 30px;
  height: 30px;
  stroke: ${BLACK};
  stroke-width: 2px;
  right: 10px;
  cursor: pointer;
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

type MainEducationHeaderViewProps = {
  isAddEducationOpened: boolean;
  isSaveEnabled: boolean;
  onClickHeaderBar: (id: string) => void;
  onClickAddEducation: () => void;
  onClickCloseModal: () => void;
  onClickSaveEducation: () => void;
};

const MainEducationHeaderView = ({
  isAddEducationOpened,
  isSaveEnabled,
  onClickHeaderBar,
  onClickAddEducation,
  onClickCloseModal,
  onClickSaveEducation,
}: MainEducationHeaderViewProps) => {
  const t_header = useScopedI18n('header');
  const t_title = useScopedI18n('title');
  const t_button = useScopedI18n('button');

  return (
    <HeaderContainer>
      <HeaderTopContainer>
        <TitleContainer>
          <MainText size={SIZE.EXTRA_LARGE} fontSize={24}>
            {t_header(MAIN_HEADER_ID.EDUCATION)}
          </MainText>
        </TitleContainer>
        <Button
          text={t_button('addEducation')}
          onClick={onClickAddEducation}
          width={100}
          height={30}
        />
      </HeaderTopContainer>
      <HeaderBottomContainer></HeaderBottomContainer>
      {/* 심방 수정 팝업*/}
      <WrappedPagePopup
        isShow={isAddEducationOpened}
        onClickClose={onClickCloseModal}
        onClickCancel={onClickCloseModal}
        onClickDone={onClickSaveEducation}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSaveEnabled}
        widthPercentage={60}
      >
        <AddEducation />
      </WrappedPagePopup>
    </HeaderContainer>
  );
};

export default MainEducationHeaderView;
