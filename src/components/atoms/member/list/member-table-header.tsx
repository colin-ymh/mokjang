import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MainText } from '@/components/atoms/common/text/main-text';
import { MEMBER } from '@/constants/member/member-column';
import { GRAY, MAIN } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';
import { getTranslatedMemberColumn } from '@/utils/translate';

import { useI18n } from '../../../../../locales/client';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  height: 23px;
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

type MemberTableHeaderProps = {
  item: {
    id: MEMBER;
    isSortable: boolean;
  };
  onClick: (id: MEMBER) => void;
};

// Component
const MemberTableHeader = ({ item, onClick }: MemberTableHeaderProps) => {
  const { memberOrderBy } = useSelector(
    (state: RootState) => state.memberFilter
  );
  const t = useI18n();
  const isActive = memberOrderBy === item.id;

  return (
    <HeaderContainer onClick={() => item.isSortable && onClick(item.id)}>
      {item.id === MEMBER.CHECK ? (
        /* =========================
           1) 체크박스 열인 경우
           ========================= */
        <div></div>
      ) : (
        /* =========================
           2) 일반 열인 경우
           ========================= */
        <TextContainer>
          <MainText
            color={isActive ? MAIN.DEFAULT : GRAY.EXTRA_DARK}
            size={SIZE.SMALL}
          >
            {getTranslatedMemberColumn(t, item.id)}
          </MainText>
        </TextContainer>
      )}
      {item.isSortable && (
        <IconContainer>
          <MainText
            size={SIZE.MEDIUM}
            color={isActive ? MAIN.DEFAULT : GRAY.DEFAULT}
          >
            {'⇅'}
          </MainText>
        </IconContainer>
      )}
    </HeaderContainer>
  );
};

export default MemberTableHeader;
