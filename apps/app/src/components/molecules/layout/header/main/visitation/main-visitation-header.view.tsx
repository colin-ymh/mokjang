import React from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';

import { GRAY, MAIN, WHITE } from '../../../../../../constants/styles/color';
import { MainText } from '../../../../../atoms/common/text/main-text';
import HeaderBar from '../../../../../atoms/layout/header/header-bar';
import { SIZE } from '../../../../../../constants/styles/style';
import { useMainVisitationHeaderBarItems } from '../../../../../../hooks/layout/header-bar-items';

import { useScopedI18n } from '../../../../../../../locales/client';
import AddVisitation from '../../../../../organisms/visitation/add/add-visitation';
import { MEDIA_MIN_WIDTH } from '../../../../../../constants/constant';
import {
  Button,
  SvgIcon,
} from '../../../../../../../../../packages/components/src';
import { MAIN_HEADER_ID } from '../../../../../../constants/layout/header';
import WrappedPagePopup from '../../../../../atoms/common/popup/wrapped-page-popup';
import { Svg } from '@mokjang/assets';

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
    <>
      <HeaderContainer>
        <HeaderTopContainer>
          <MainText size={SIZE.EXTRA_LARGE} fontSize={24}>
            {t_header(MAIN_HEADER_ID.VISITATION)}
          </MainText>
          <Button
            text={t_button('addVisitation')}
            onClick={onClickAddVisitation}
            width={'auto'}
            fontWeight={500}
            fontSize={16}
            height={35}
            icon={<SvgIcon svg={Svg.Plus} color={WHITE} width={2} size={18} />}
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
      <WrappedPagePopup
        isShow={isAddVisitationOpened}
        onClickClose={onClickCloseModal}
        onClickCancel={onClickCloseModal}
        headerTitle={t_title('addVisitation')}
        onClickDone={onClickSaveVisitation}
        doneDisabled={!isSaveEnabled}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : GRAY.LIGHT}
      >
        <AddVisitation />
      </WrappedPagePopup>
    </>
  );
};

export default MainVisitationHeaderView;
