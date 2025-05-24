import React from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';

import { GRAY, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import HeaderBar from '@/components/atoms/layout/header/header-bar';
import { SIZE } from '@/constants/styles/style';
import { useMainVisitationHeaderBarItems } from '@/hooks/layout/header-bar-items';

import { useScopedI18n } from '../../../../../../../locales/client';
import AddVisitation from '@/components/organisms/visitation/add/add-visitation';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import Button from '@/components/atoms/common/button/button';

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

type MainVisitationHeaderViewProps = {
  isSaveEnabled: boolean;
  isAddVisitationOpened: boolean;
  onClickHeaderBar: (id: string) => void;
  onClickAddVisitation: () => void;
  onClickCloseModal: () => void;
  onClickSaveVisitation: () => void;
};

const MainVisitationHeaderView = ({
  isSaveEnabled,
  isAddVisitationOpened,
  onClickHeaderBar,
  onClickAddVisitation,
  onClickCloseModal,
  onClickSaveVisitation,
}: MainVisitationHeaderViewProps) => {
  const slug = useParams().slug as string[];
  const contentId = slug[2];

  const t_header = useScopedI18n('header');
  const t_title = useScopedI18n('title');
  const t_button = useScopedI18n('button');
  const headerBarItems = useMainVisitationHeaderBarItems();

  return (
    <HeaderContainer>
      <HeaderTopContainer>
        <MainText size={SIZE.EXTRA_LARGE}>{t_header('visitation')}</MainText>
        <Button
          text={t_button('addVisitation')}
          onClick={onClickAddVisitation}
          width={100}
          height={30}
        />
      </HeaderTopContainer>
      <HeaderBottomContainer>
        <HeaderBar
          value={contentId}
          items={headerBarItems}
          onClick={onClickHeaderBar}
        />
      </HeaderBottomContainer>
      {/* 심방 추가 팝업*/}
      <SlidePopup
        headerTitle={t_title('addVisitation')}
        isShow={isAddVisitationOpened}
        onClickClose={onClickCloseModal}
        onClickDone={onClickSaveVisitation}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSaveEnabled}
      >
        <AddVisitation />
      </SlidePopup>
    </HeaderContainer>
  );
};

export default MainVisitationHeaderView;
