import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import { MainText } from '@mokjang/components';
import { ORDER_DIRECTION, VISITATION } from '@mokjang/constants';
import { BLACK, GRAY, MAIN } from '@mokjang/constants';
import { SIZE } from '@mokjang/constants';
import { getTranslatedVisitationColumn } from '../../../utils/translate';
import { useI18n } from '../../../../locales/client';

import { Svg } from '@mokjang/assets';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
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

type VisitationTableHeaderProps = {
  item: {
    id: VISITATION;
    isSortable: boolean;
  };
  onClick: (id: VISITATION) => void;
};

// Component
const VisitationTableHeader = ({
  item,
  onClick,
}: VisitationTableHeaderProps) => {
  const { visitationOrderBy, visitationOrderDirection } = useSelector(
    (state: RootState) => state.visitationFilter
  );
  const t = useI18n();
  const isActive = visitationOrderBy === item.id;

  return (
    <HeaderContainer onClick={() => item.isSortable && onClick(item.id)}>
      <TextContainer>
        <MainText
          color={isActive ? BLACK : GRAY.DARK}
          size={SIZE.SMALL}
          fontWeight={600}
        >
          {getTranslatedVisitationColumn(t, item.id)}
        </MainText>
      </TextContainer>
      {item.isSortable && (
        <IconContainer>
          {visitationOrderBy !== item.id ? (
            <ArrowUpDownIcon />
          ) : visitationOrderDirection === ORDER_DIRECTION.ASC ? (
            <ArrowUp />
          ) : (
            <ArrowDown />
          )}
        </IconContainer>
      )}
    </HeaderContainer>
  );
};

export default VisitationTableHeader;
