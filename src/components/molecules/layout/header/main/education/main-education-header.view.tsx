import React from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';

import { BLACK, GRAY, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import HeaderBar from '@/components/atoms/layout/header/header-bar';
import { SIZE } from '@/constants/styles/style';
import { useMainEducationHeaderBarItems } from '@/hooks/layout/header-bar-items';

import { useScopedI18n } from '../../../../../../../locales/client';

import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import Button from '@/components/atoms/common/button/button';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import AddEducation from '@/components/organisms/education/education/add/add-education';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { EDUCATION_CONTENT_ID } from '@/constants/layout/content';

import ChevronLeft from '../../../../../../../public/svg/chevron-left.svg';
import AddEducationTerm from '@/components/organisms/education/education-term/add/add-education-term';
import SlidePopup from '@/components/atoms/common/popup/slide-popup';

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
    border-bottom: 0.7px solid ${GRAY.SEMI_LIGHT};
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

const GoBackButton = styled(ChevronLeft)`
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
  isAddEducationTermOpened: boolean;
  isSaveEnabled: boolean;
  isTermSaveEnabled: boolean;
  onClickHeaderBar: (id: string) => void;
  onClickAddEducation: () => void;
  onClickCloseModal: () => void;
  onClickSaveEducation: () => void;
  onClickAddEducationTerm: () => void;
  onClickCloseTermModal: () => void;
  onClickSaveEducationTerm: () => void;
  onClickGoBack: () => void;
};

const MainEducationHeaderView = ({
  isAddEducationOpened,
  isAddEducationTermOpened,
  isSaveEnabled,
  isTermSaveEnabled,
  onClickHeaderBar,
  onClickAddEducation,
  onClickCloseModal,
  onClickSaveEducation,
  onClickAddEducationTerm,
  onClickCloseTermModal,
  onClickSaveEducationTerm,
  onClickGoBack,
}: MainEducationHeaderViewProps) => {
  const slug = useParams().slug as string[];
  const contentId = slug[2];

  const isTerm = contentId === EDUCATION_CONTENT_ID.TERM;
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );

  const t_header = useScopedI18n('header');
  const t_title = useScopedI18n('title');
  const t_button = useScopedI18n('button');
  const headerBarItems = useMainEducationHeaderBarItems();

  return (
    <HeaderContainer>
      <HeaderTopContainer>
        <TitleContainer>
          {isTerm && <GoBackButton onClick={onClickGoBack} />}
          <MainText size={SIZE.EXTRA_LARGE}>
            {isTerm ? targetEducation.name : t_header('education')}
          </MainText>
        </TitleContainer>
        <Button
          text={t_button(isTerm ? 'addEducationTerm' : 'addEducation')}
          onClick={isTerm ? onClickAddEducationTerm : onClickAddEducation}
          width={100}
          height={30}
        />
      </HeaderTopContainer>
      <HeaderBottomContainer>
        {!isTerm && (
          <HeaderBar
            value={contentId}
            items={headerBarItems}
            onClick={onClickHeaderBar}
          />
        )}
      </HeaderBottomContainer>
      {/* 교육 추가 */}
      <CustomPopup
        isShow={isAddEducationOpened}
        onClickCancel={onClickCloseModal}
        headerTitle={t_title('addEducation')}
        width={500}
        height={300}
        onClickDone={onClickSaveEducation}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSaveEnabled}
      >
        <AddEducation />
      </CustomPopup>
      {/* 기수 추가 */}
      <SlidePopup
        headerTitle={t_title('addEducationTerm')}
        isShow={isAddEducationTermOpened}
        onClickClose={onClickCloseTermModal}
        onClickDone={onClickSaveEducationTerm}
        doneBackgroundColor={isTermSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isTermSaveEnabled}
      >
        <AddEducationTerm />
      </SlidePopup>
    </HeaderContainer>
  );
};

export default MainEducationHeaderView;
