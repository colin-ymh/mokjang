import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MainText } from '@/components/atoms/common/text/main-text';
import { BLACK, GRAY, MAIN } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';
import { getTranslatedJoinRequestColumn } from '@/utils/translate';
import { useI18n } from '../../../../locales/client';
import { JOIN_REQUEST } from '@/constants/join-request/join-request-column';
import { USER } from '@/constants/user/user-column';

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
