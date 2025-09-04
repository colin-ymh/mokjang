import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import { MainText } from '@mokjang/components';
import { BLACK, GRAY, MAIN } from '@mokjang/constants';
import { SIZE } from '@mokjang/constants';
import { getTranslatedChurchUserColumn } from '@mokjang/utils';
import { useScopedI18n } from '../../../../../locales/client';
import { CHURCH_USER } from '@mokjang/constants';

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

type UserTableHeaderProps = {
  item: {
    id: CHURCH_USER;
    isSortable: boolean;
  };
  onClick: (id: CHURCH_USER) => void;
};

// Component
const ChurchUserTableHeader = ({ item, onClick }: UserTableHeaderProps) => {
  const { churchUserOrderBy } = useSelector(
    (state: RootState) => state.churchUserFilter
  );
  const t_header = useScopedI18n('tableHeader');
  const isActive = churchUserOrderBy === item.id;

  return (
    <HeaderContainer onClick={() => item.isSortable && onClick(item.id)}>
      <TextContainer>
        <MainText
          color={isActive ? BLACK : GRAY.DARK}
          size={SIZE.SMALL}
          fontWeight={600}
        >
          {getTranslatedChurchUserColumn(t_header, item.id)}
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

export default ChurchUserTableHeader;
