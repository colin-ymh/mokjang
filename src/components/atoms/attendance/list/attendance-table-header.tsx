import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MainText } from '@/components/atoms/common/text/main-text';
import { BLACK, GRAY, MAIN } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';
import { getTranslatedAttendanceColumn } from '@/utils/translate';
import { useI18n } from '../../../../../locales/client';
import { WORSHIP_ENROLLMENT } from '@/constants/column/worship-column';
import { EDUCATION_TABLE_HEADER_ITEM } from '@/redux/reducers/filter/worship-enrollment-filter-reducer';

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

type TaskTableHeaderProps = {
  item: EDUCATION_TABLE_HEADER_ITEM;
  onClick: (
    id: WORSHIP_ENROLLMENT | string,
    isSession: boolean,
    sessionDate?: Date
  ) => void;
};

const AttendanceTableHeader = ({ item, onClick }: TaskTableHeaderProps) => {
  const { worshipEnrollmentOrderBy } = useSelector(
    (state: RootState) => state.worshipEnrollmentFilter
  );
  const t = useI18n();
  const isActive = worshipEnrollmentOrderBy === item.id;

  return (
    <HeaderContainer
      onClick={() => onClick(item.id, item.isSession, item?.date)}
    >
      <TextContainer>
        <MainText
          color={isActive ? BLACK : GRAY.DARK}
          size={SIZE.SMALL}
          fontWeight={600}
        >
          {item.isSession
            ? item.title
            : getTranslatedAttendanceColumn(t, item.id as WORSHIP_ENROLLMENT)}
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

export default AttendanceTableHeader;
