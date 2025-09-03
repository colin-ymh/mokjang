import React from 'react';
import styled from 'styled-components';

import { MainText } from '../../common/text/main-text';
import { EDUCATION_ENROLLMENT } from '../../../../constants/column/education-column';
import { BLACK, GRAY, MAIN } from '../../../../constants/styles/color';
import { SIZE } from '../../../../constants/styles/style';
import { getTranslatedEducationEnrollmentColumn } from '../../../../utils/translate';
import Arrow from '../../../../../public/svg/arror-up.svg';
import ArrowUpDown from '../../../../../public/svg/arrow-up-down.svg';
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
