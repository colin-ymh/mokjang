import React from 'react';
import styled from 'styled-components';

import { BLACK, GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import HeaderBar from '@/components/atoms/layout/header/header-bar';
import { useMemberHeaderBarItems } from '@/hooks/layout/header-bar-items';
import Button from '@/components/atoms/common/button/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { SIZE } from '@/constants/styles/style';

import { useScopedI18n } from '../../../../../locales/client';

const HeaderContainer = styled.div`
  display: block;
  flex-direction: column;
  justify-content: flex-start;
  padding: 30px 20px 0 20px;
  gap: 20px;
  border-bottom: 1px solid ${GRAY.LIGHT};
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

type MemberHeadBarViewProps = {
  onClickRegisterMemberButton: () => void;
  onClickHeaderBar: (id: string) => void;
  onClickDummyMembers: () => void;
};

const MemberTabHeaderView = ({
  onClickRegisterMemberButton,
  onClickHeaderBar,
  onClickDummyMembers,
}: MemberHeadBarViewProps) => {
  const t_button = useScopedI18n('button');
  const t_header = useScopedI18n('header');
  const contentId = useSelector((state: RootState) => state.layout.contentId);
  const headerBarItems = useMemberHeaderBarItems();

  return (
    <HeaderContainer>
      <MainText size={SIZE.EXTRA_LARGE}>{t_header('member')}</MainText>
      <HeaderBottomContainer>
        <HeaderBar
          value={contentId}
          items={headerBarItems}
          onClick={onClickHeaderBar}
        />
        <ButtonContainer>
          <Button
            text={'테스트용 교인 생성하기'}
            width={200}
            height={30}
            onClick={onClickDummyMembers}
            backgroundColor={BLACK}
          />
          <Button
            text={t_button('addMember')}
            height={30}
            width={100}
            onClick={onClickRegisterMemberButton}
          />
        </ButtonContainer>
      </HeaderBottomContainer>
    </HeaderContainer>
  );
};

export default MemberTabHeaderView;
