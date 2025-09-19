import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import { MainText } from '../../../../../../packages/components/src';
import { BLACK, GRAY, MAIN } from '../../../../../../packages/constants/src';
import { JOIN_REQUEST, SIZE, USER } from '@mokjang/constants';
import { getTranslatedJoinRequestColumn } from '@mokjang/utils';
import { useI18n } from '../../../../locales/client';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
  cursor: pointer;
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

type JoinRequestTableHeaderProps = {
  item: {
    id: JOIN_REQUEST | USER;
    isSortable: boolean;
  };
  onClick: (id: JOIN_REQUEST | USER) => void;
};

// Component
const JoinRequestTableHeader = ({
  item,
  onClick,
}: JoinRequestTableHeaderProps) => {
  const { joinRequestOrderBy } = useSelector(
    (state: RootState) => state.joinRequestFilter
  );
  const t = useI18n();
  const isActive = joinRequestOrderBy === item.id;

  return (
    <HeaderContainer onClick={() => item.isSortable && onClick(item.id)}>
      <TextContainer>
        <MainText
          color={isActive ? BLACK : GRAY.DARK}
          size={SIZE.SMALL}
          fontWeight={600}
        >
          {getTranslatedJoinRequestColumn(t, item.id)}
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

export default JoinRequestTableHeader;
