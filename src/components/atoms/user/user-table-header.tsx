import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MainText } from '@/components/atoms/common/text/main-text';
import { USER } from '@/constants/user/user-column';
import { BLACK, GRAY, MAIN } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';
import { getTranslatedUserColumn } from '@/utils/translate';
import { useI18n } from '../../../../locales/client';
import { MEMBER } from '@/constants/member/member-column';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  height: 30px;
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 5px;
  margin-bottom: 3px;
  cursor: pointer;
`;

type UserTableHeaderProps = {
  item: {
    id: USER | MEMBER;
    isSortable: boolean;
  };
  onClick: (id: USER | MEMBER) => void;
};

// Component
const UserTableHeader = ({ item, onClick }: UserTableHeaderProps) => {
  const { userOrderBy } = useSelector((state: RootState) => state.userFilter);
  const t = useI18n();
  const isActive = userOrderBy === item.id;

  return (
    <HeaderContainer onClick={() => item.isSortable && onClick(item.id)}>
      <TextContainer>
        <MainText
          color={isActive ? BLACK : GRAY.DARK}
          size={SIZE.SMALL}
          fontWeight={600}
        >
          {getTranslatedUserColumn(t, item.id)}
        </MainText>
      </TextContainer>
      {item.isSortable && (
        <IconContainer>
          <MainText
            size={SIZE.EXTRA_SMALL}
            color={isActive ? MAIN.DEFAULT : GRAY.DEFAULT}
          >
            {'⇅'}
          </MainText>
        </IconContainer>
      )}
    </HeaderContainer>
  );
};

export default UserTableHeader;
