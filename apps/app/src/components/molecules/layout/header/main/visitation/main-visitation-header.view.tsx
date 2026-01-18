import React from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';

import { GRAY, MAIN, MEDIA_MIN_WIDTH, SIZE, WHITE } from '@mokjang/constants';
import { Button, MainText, SvgIcon } from '@mokjang/components';
import HeaderBar from '../../../../../atoms/layout/header/header-bar';
import { useMainVisitationHeaderBarItems } from '@/hooks/layout/header-bar-items';

import { useScopedI18n } from '../../../../../../../locales/client';
import AddVisitation from '../../../../../organisms/visitation/add/add-visitation';
import { Svg } from '@mokjang/assets';
import { MAIN_HEADER_ID } from '@/constants/layout/header';
import ScrollSlidePopup from '@/components/atoms/common/popup/scroll-slide-popup';
import { useIsMobile } from '@/hooks/window/window';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    height: 50px;
    justify-content: center;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    height: 80px;
    padding: 0;
    justify-content: space-between;
    //border-bottom: 0.7px solid ${GRAY.SEMI_LIGHT};
  }
`;

const HeaderTopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const DesktopTitle = styled.div`
  display: none;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
  }
`;

const MobileTitle = styled.div`
  display: flex;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
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

  const isMobile = useIsMobile();

  return (
    <>
      <HeaderContainer>
        <HeaderTopContainer>
          <DesktopTitle>
            <MainText size={SIZE.EXTRA_LARGE} fontSize={24}>
              {t_header(MAIN_HEADER_ID.VISITATION)}
            </MainText>
          </DesktopTitle>
          <MobileTitle>
            <MainText size={SIZE.EXTRA_LARGE}>
              {t_header(MAIN_HEADER_ID.VISITATION)}
            </MainText>
          </MobileTitle>
          <Button
            text={t_button('addVisitation')}
            onClick={onClickAddVisitation}
            width={'auto'}
            fontWeight={500}
            fontSize={16}
            height={35}
            icon={
              <SvgIcon
                svg={Svg.Plus}
                color={isMobile ? MAIN.DEFAULT : WHITE}
                width={2}
                size={20}
              />
            }
            backgroundColor={isMobile ? WHITE : MAIN.DEFAULT}
            color={isMobile ? MAIN.DEFAULT : WHITE}
          />
        </HeaderTopContainer>
        <HeaderBottomContainer>
          <HeaderBar
            value={contentId}
            items={headerBarItems}
            onClick={onClickHeaderBar}
          />
        </HeaderBottomContainer>
      </HeaderContainer>

      {/* 심방 추가 팝업*/}
      <ScrollSlidePopup
        isShow={isAddVisitationOpened}
        onClickClose={onClickCloseModal}
        onClickCancel={onClickCloseModal}
        onClickDone={onClickSaveVisitation}
        headerTitle={t_title('addVisitation')}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSaveEnabled}
      >
        <AddVisitation />
      </ScrollSlidePopup>
    </>
  );
};

export default MainVisitationHeaderView;
