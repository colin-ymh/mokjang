import React from 'react';
import styled from 'styled-components';

import { MainText } from '@mokjang/components';
import { EDUCATION_ENROLLMENT } from '@mokjang/constants';
import { BLACK, GRAY, MAIN } from '@mokjang/constants';
import { SIZE } from '@mokjang/constants';
import { getTranslatedEducationEnrollmentColumn } from '@mokjang/utils';
import { Svg } from '@mokjang/assets';
import { useI18n } from '../../../../../locales/client';

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

type EducationEnrollmentTableHeaderProps = {
  item: {
    id: EDUCATION_ENROLLMENT;
    isSortable: boolean;
  };
  onClick: (id: EDUCATION_ENROLLMENT) => void;
};

// Component
const EducationEnrollmentTableHeader = ({
  item,
  onClick,
}: EducationEnrollmentTableHeaderProps) => {
  const t = useI18n();

  return (
    <HeaderContainer onClick={() => item.isSortable && onClick(item.id)}>
      <TextContainer>
        <MainText color={BLACK} size={SIZE.SMALL} fontWeight={600}>
          {getTranslatedEducationEnrollmentColumn(t, item.id)}
        </MainText>
      </TextContainer>
      {/*{item.isSortable && (*/}
      {/*  <IconContainer>*/}
      {/*    {educationOrderBy !== item.id ? (*/}
      {/*      <ArrowUpDownIcon />*/}
      {/*    ) : educationOrderDirection === ORDER_DIRECTION.ASC ? (*/}
      {/*      <ArrowUp />*/}
      {/*    ) : (*/}
      {/*      <ArrowDown />*/}
      {/*    )}*/}
      {/*  </IconContainer>*/}
      {/*)}*/}
    </HeaderContainer>
  );
};

export default EducationEnrollmentTableHeader;
