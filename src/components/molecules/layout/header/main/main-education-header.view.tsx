import React from 'react';
import styled from 'styled-components';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import HeaderBar from '@/components/atoms/layout/header/header-bar';
import { SIZE } from '@/constants/styles/style';

import { useScopedI18n } from '../../../../../../locales/client';
import { useParams } from 'next/navigation';
import { useMainEducationHeaderBarItems } from '@/hooks/layout/header-bar-items';

const HeaderContainer = styled.div`
  display: block;
  flex-direction: column;
  justify-content: flex-start;
  padding: 30px 20px 0 20px;
  gap: 20px;
  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};
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

type MainEducationHeaderViewProps = {
  onClickHeaderBar: (id: string) => void;
};

const MainEducationHeaderView = ({
  onClickHeaderBar,
}: MainEducationHeaderViewProps) => {
  const slug = useParams().slug as string[];
  const contentId = slug[2];

  const t_header = useScopedI18n('header');
  const headerBarItems = useMainEducationHeaderBarItems();

  return (
    <HeaderContainer>
      <MainText size={SIZE.EXTRA_LARGE}>{t_header('education')}</MainText>
      <HeaderBottomContainer>
        <HeaderBar
          value={contentId}
          items={headerBarItems}
          onClick={onClickHeaderBar}
        />
        <ButtonContainer></ButtonContainer>
      </HeaderBottomContainer>
    </HeaderContainer>
  );
};

export default MainEducationHeaderView;
