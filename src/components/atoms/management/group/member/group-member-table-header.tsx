import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { MEMBER } from '@/constants/column/member-column';
import { GRAY } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';
import { getTranslatedMemberColumn } from '@/utils/translate';

import { useI18n } from '../../../../../../locales/client';
import React from 'react';

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

type GroupMemberTableHeaderProps = {
  item: {
    id: MEMBER;
    isSortable: boolean;
  };
  onClick: (id: MEMBER) => void;
};

const GroupMemberTableHeader = ({
  item,
  onClick,
}: GroupMemberTableHeaderProps) => {
  const t = useI18n();

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
          <MainText color={GRAY.DARK}>
            {getTranslatedMemberColumn(t, item.id)}
          </MainText>
        </TextContainer>
      )}
      {item.isSortable && (
        <IconContainer>
          <MainText size={SIZE.LARGE} color={GRAY.DEFAULT}>
            {'⇅'}
          </MainText>
        </IconContainer>
      )}
    </HeaderContainer>
  );
};

export default GroupMemberTableHeader;
