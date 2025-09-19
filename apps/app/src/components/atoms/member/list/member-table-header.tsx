import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import { MainText } from '@mokjang/components';
import { MEMBER } from '@mokjang/constants';
import { BLACK, GRAY, MAIN } from '@mokjang/constants';
import { SIZE } from '@mokjang/constants';
import { getTranslatedMemberColumn } from '@mokjang/utils';

import { useI18n } from '../../../../../locales/client';
import { Svg } from '@mokjang/assets';
import { ORDER_DIRECTION } from '@mokjang/constants';

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

const ArrowUp = styled(Svg.ArrorUp)`
  width: 14px;
  height: 14px;
  stroke-width: 2px;
  stroke: ${MAIN.DEFAULT};
`;

const ArrowDown = styled(Svg.ArrorUp)`
  width: 14px;
  height: 14px;
  stroke-width: 2px;
  stroke: ${MAIN.DEFAULT};
  transform: rotate(180deg);
`;

const ArrowUpDownIcon = styled(Svg.ArrowUpDown)`
  width: 14px;
  height: 14px;
  stroke-width: 2px;
  stroke: ${GRAY.DEFAULT};
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
  const { memberSortBy, memberSortDirection } = useSelector(
    (state: RootState) => state.memberFilter
  );
  const t = useI18n();
  const isActive = memberSortBy === item.id;

  return (
    <HeaderContainer
      onClick={() => item.isSortable && onClick(item.id)}
      $isProfile={item.id === MEMBER.NAME}
    >
      <TextContainer>
        <MainText
          color={isActive ? BLACK : BLACK}
          size={SIZE.SMALL}
          fontWeight={600}
        >
          {getTranslatedMemberColumn(t, item.id)}
        </MainText>
      </TextContainer>
      {item.isSortable && (
        <IconContainer>
          {memberSortBy !== item.id ? (
            <ArrowUpDownIcon />
          ) : memberSortDirection === ORDER_DIRECTION.ASC ? (
            <ArrowUp />
          ) : (
            <ArrowDown />
          )}
        </IconContainer>
      )}
    </HeaderContainer>
  );
};

export default MemberTableHeader;
