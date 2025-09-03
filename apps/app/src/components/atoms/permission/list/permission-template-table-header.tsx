import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import { MainText } from '@mokjang/components';
import { PERMISSION_TEMPLATE } from '@mokjang/constants';
import { BLACK, GRAY, MAIN } from '@mokjang/constants';
import { SIZE } from '@mokjang/constants';
import { getTranslatedPermissionTemplateColumn } from '@mokjang/utils';
import { useScopedI18n } from '../../../../../locales/client';

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

type PermissionTemplateTableHeaderProps = {
  item: {
    id: PERMISSION_TEMPLATE;
    isSortable: boolean;
  };
  onClick: (id: PERMISSION_TEMPLATE) => void;
};

// Component
const PermissionTemplateTableHeader = ({
  item,
  onClick,
}: PermissionTemplateTableHeaderProps) => {
  const { permissionTemplateOrderBy } = useSelector(
    (state: RootState) => state.permissionTemplateFilter
  );
  const t_header = useScopedI18n('tableHeader');
  const isActive = permissionTemplateOrderBy === item.id;

  return (
    <HeaderContainer onClick={() => item.isSortable && onClick(item.id)}>
      <TextContainer>
        <MainText
          color={isActive ? BLACK : GRAY.DARK}
          size={SIZE.SMALL}
          fontWeight={600}
        >
          {getTranslatedPermissionTemplateColumn(t_header, item.id)}
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

export default PermissionTemplateTableHeader;
