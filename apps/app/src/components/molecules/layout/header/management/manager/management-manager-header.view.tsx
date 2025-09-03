import React from 'react';
import styled from 'styled-components';

import { GRAY } from '@mokjang/constants';
import { MainText } from '@mokjang/components';
import { SIZE } from '@mokjang/constants';

import { useScopedI18n } from '../../../../../../../locales/client';
import { useParams } from 'next/navigation';
import { MEDIA_MIN_WIDTH } from '@mokjang/constants';
import { MANAGEMENT_HEADER_ID } from '@/constants/layout/header';
import { useManagerHeaderBarItems } from '@/hooks/layout/header-bar-items';
import { MANAGER_CONTENT_ID } from '@/constants/layout/content';
import HeaderBar from '@/components/atoms/layout/header/header-bar';

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

type ManagementManagerHeaderViewProps = {
  onClickHeaderBar: (id: MANAGER_CONTENT_ID) => void;
};

const ManagementManagerHeaderView = ({
  onClickHeaderBar,
}: ManagementManagerHeaderViewProps) => {
  const slug = useParams().slug as string[];
  const contentId = slug[2];

  const t_header = useScopedI18n('header');
  const headerBarItems = useManagerHeaderBarItems();

  return (
    <HeaderContainer>
      <HeaderTopContainer>
        <MainText size={SIZE.EXTRA_LARGE} fontSize={24}>
          {t_header(MANAGEMENT_HEADER_ID.MANAGER)}
        </MainText>
      </HeaderTopContainer>
      <HeaderBottomContainer>
        <HeaderBar
          value={contentId}
          items={headerBarItems}
          onClick={onClickHeaderBar}
        />
      </HeaderBottomContainer>
    </HeaderContainer>
  );
};

export default ManagementManagerHeaderView;
