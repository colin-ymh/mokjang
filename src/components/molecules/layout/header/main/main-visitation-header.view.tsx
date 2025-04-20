import React from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import HeaderBar from '@/components/atoms/layout/header/header-bar';
import { SIZE } from '@/constants/styles/style';
import { useMainVisitationHeaderBarItems } from '@/hooks/layout/header-bar-items';

import { useScopedI18n } from '../../../../../../locales/client';
import Plus from '../../../../../../public/svg/plus.svg';
import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import AddVisitation from '@/components/organisms/visitation/add/add-visitation';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    height: 40px;
    padding: 0 20px;
    justify-content: center;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    height: auto;
    padding: 20px 20px 0 20px;
    border-bottom: 1px solid ${GRAY.LIGHT};
  }
`;

const HeaderTopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const HeaderBottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  gap: 10px;
  flex-direction: row;
`;

const AddButton = styled(Plus)`
  width: 25px;
  height: 25px;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    background-color: ${GRAY.LIGHT};
    border-radius: 5px;
  }
`;

type MainVisitationHeaderViewProps = {
  isAddVisitationOpened: boolean;
  onClickHeaderBar: (id: string) => void;
  onClickAddVisitation: () => void;
  onClickCloseModal: () => void;
};

const MainVisitationHeaderView = ({
  isAddVisitationOpened,
  onClickHeaderBar,
  onClickAddVisitation,
  onClickCloseModal,
}: MainVisitationHeaderViewProps) => {
  const slug = useParams().slug as string[];
  const contentId = slug[2];

  const t_header = useScopedI18n('header');
  const headerBarItems = useMainVisitationHeaderBarItems();

  return (
    <HeaderContainer>
      <HeaderTopContainer>
        <MainText size={SIZE.EXTRA_LARGE}>{t_header('visitation')}</MainText>
        <ButtonContainer>
          <AddButton onClick={onClickAddVisitation} />
        </ButtonContainer>
      </HeaderTopContainer>
      <HeaderBottomContainer>
        <HeaderBar
          value={contentId}
          items={headerBarItems}
          onClick={onClickHeaderBar}
        />
      </HeaderBottomContainer>
      <SlidePopup
        isShow={isAddVisitationOpened}
        onClickClose={onClickCloseModal}
      >
        <AddVisitation />
      </SlidePopup>
    </HeaderContainer>
  );
};

export default MainVisitationHeaderView;
