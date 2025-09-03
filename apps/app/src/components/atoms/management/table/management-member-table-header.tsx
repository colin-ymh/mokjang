import React from 'react';
import styled from 'styled-components';

import { MainText } from '../../common/text/main-text';
import { MEMBER } from '../../../../constants/column/member-column';
import { GRAY, MAIN } from '../../../../constants/styles/color';
import { getTranslatedMemberColumn } from '../../../../utils/translate';
import { BLANK, ORDER_DIRECTION } from '../../../../constants/constant';

import { useI18n } from '../../../../../locales/client';
import Arrow from '../../../../../public/svg/arror-up.svg';
import ArrowUpDown from '../../../../../public/svg/arrow-up-down.svg';

const HeaderContainer = styled.div<{ $isProfile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isProfile }) =>
    $isProfile ? 'flex-start' : 'center'};
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
  stroke-width: 2px;
  stroke: ${MAIN.DEFAULT};
`;

const ArrowDown = styled(Arrow)`
  width: 14px;
  height: 14px;
  stroke-width: 2px;
  stroke: ${MAIN.DEFAULT};
  transform: rotate(180deg);
`;

const ArrowUpDownIcon = styled(ArrowUpDown)`
  width: 14px;
  height: 14px;
  stroke-width: 2px;
  stroke: ${GRAY.DEFAULT};
`;

type GroupMemberTableHeaderProps = {
  item: {
    id: MEMBER | typeof BLANK;
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
    <HeaderContainer
      onClick={() => item.isSortable && onClick(item.id as MEMBER)}
      $isProfile={item.id === MEMBER.NAME}
    >
      <TextContainer>
        <MainText color={GRAY.DARK}>
          {getTranslatedMemberColumn(t, item.id as MEMBER)}
        </MainText>
      </TextContainer>
      {item.isSortable && (
        <IconContainer>
          {orderBy !== item.id ? (
            <ArrowUpDownIcon />
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
