import React from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { MEMBER } from '@/constants/column/member-column';
import { GRAY, MAIN } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';
import { getTranslatedMemberColumn } from '@/utils/translate';
import { ORDER_DIRECTION } from '@/constants/constant';

import { useI18n } from '../../../../../locales/client';
import Arrow from '../../../../../public/svg/arror-up.svg';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 10px;
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
  cursor: pointer;
`;

const ArrowUp = styled(Arrow)`
  width: 14px;
  height: 14px;
  stroke-width: 3px;
  stroke: ${MAIN.DEFAULT};
`;

const ArrowDown = styled(Arrow)`
  width: 14px;
  height: 14px;
  stroke-width: 3px;
  stroke: ${MAIN.DEFAULT};
  transform: rotate(180deg);
`;

type GroupMemberTableHeaderProps = {
  item: {
    id: MEMBER;
    isSortable: boolean;
  };
  onClick: (id: MEMBER) => void;
  orderBy: MEMBER | null;
  orderDirection: ORDER_DIRECTION | null;
};

const ManagementMemberTableHeader = ({
  item,
  onClick,
  orderBy,
  orderDirection,
}: GroupMemberTableHeaderProps) => {
  const t = useI18n();

  return (
    <HeaderContainer onClick={() => item.isSortable && onClick(item.id)}>
      <TextContainer>
        <MainText color={GRAY.DARK}>
          {getTranslatedMemberColumn(t, item.id)}
        </MainText>
      </TextContainer>
      {item.isSortable && (
        <IconContainer>
          {orderBy !== item.id ? (
            <MainText size={SIZE.SMALL} color={GRAY.DEFAULT}>
              {'⇅'}
            </MainText>
          ) : orderDirection === ORDER_DIRECTION.ASC ? (
            <ArrowUp />
          ) : (
            <ArrowDown />
          )}
        </IconContainer>
      )}
    </HeaderContainer>
  );
};

export default ManagementMemberTableHeader;
