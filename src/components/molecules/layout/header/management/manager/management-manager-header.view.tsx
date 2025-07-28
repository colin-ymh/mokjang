import React from 'react';
import styled from 'styled-components';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';

import { useScopedI18n } from '../../../../../../../locales/client';
import { useParams } from 'next/navigation';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import { MANAGEMENT_HEADER_ID } from '@/constants/layout/header';

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
  onClickHeaderBar: (id: string) => void;
};

const ManagementManagerHeaderView = ({
  onClickHeaderBar,
}: ManagementManagerHeaderViewProps) => {
  const slug = useParams().slug as string[];
  const contentId = slug[2];

  const t_header = useScopedI18n('header');

  return (
    <HeaderContainer>
      <HeaderTopContainer>
        <MainText size={SIZE.EXTRA_LARGE} fontSize={24}>
          {t_header(MANAGEMENT_HEADER_ID.MANAGER)}
        </MainText>
        {/*<Button*/}
        {/*  text={t_button('addVisitation')}*/}
        {/*  onClick={onClickAddVisitation}*/}
        {/*  width={100}*/}
        {/*  height={30}*/}
        {/*/>*/}
      </HeaderTopContainer>
      <HeaderBottomContainer></HeaderBottomContainer>
    </HeaderContainer>
  );
};

export default ManagementManagerHeaderView;
