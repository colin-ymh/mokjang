import React from 'react';
import styled from 'styled-components';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';

import { useScopedI18n } from '../../../../../../../locales/client';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import { MAIN_HEADER_ID } from '@/constants/layout/header';
import Button from '@/components/atoms/common/button/button';
import { useAttendanceHeaderBarItems } from '@/hooks/layout/header-bar-items';
import HeaderBar from '@/components/atoms/layout/header/header-bar';
import { useParams } from 'next/navigation';

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

type MainAttendanceHeaderViewProps = {
  onClickHeaderBar: (id: string) => void;
  onClickSessionOpen: () => void;
  onClickAddWorship: () => void;
};

const MainAttendanceHeaderView = ({
  onClickHeaderBar,
  onClickSessionOpen,
  onClickAddWorship,
}: MainAttendanceHeaderViewProps) => {
  const slug = useParams().slug as string[];
  const contentId = slug[2];

  const t_header = useScopedI18n('header');
  const t_button = useScopedI18n('button');

  const headerBarItems = useAttendanceHeaderBarItems();

  return (
    <HeaderContainer>
      <HeaderTopContainer>
        <MainText size={SIZE.EXTRA_LARGE}>
          {`${t_header(MAIN_HEADER_ID.WORSHIP)} / ${t_header(MAIN_HEADER_ID.ATTENDANCE)}`}
        </MainText>
        {contentId === MAIN_HEADER_ID.ATTENDANCE ? (
          <Button
            text={t_button('addWorshipSession')}
            onClick={onClickSessionOpen}
            width={150}
            height={30}
          />
        ) : (
          <Button
            text={t_button('addWorship')}
            onClick={onClickAddWorship}
            width={100}
            height={30}
          />
        )}
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

export default MainAttendanceHeaderView;
