import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MainText } from '@/components/atoms/common/text/main-text';
import { BLACK, GRAY, MAIN } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';
import { getTranslatedAttendanceInformationColumn } from '@/utils/translate';
import { useI18n } from '../../../../../locales/client';
import { WORSHIP_ATTENDANCE } from '@/constants/column/worship-column';
import { ATTENDANCE_INFORMATION_TABLE_HEADER_ITEM } from '@/redux/reducers/filter/worship-attendance-filter-reducer';

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

type AttendanceInformationTableHeaderProps = {
  item: ATTENDANCE_INFORMATION_TABLE_HEADER_ITEM;
};

const AttendanceInformationInformationTableHeader = ({
  item,
}: AttendanceInformationTableHeaderProps) => {
  const { worshipAttendanceOrderBy } = useSelector(
    (state: RootState) => state.worshipAttendanceFilter
  );
  const t = useI18n();
  const isActive = worshipAttendanceOrderBy === item.id;

  return (
    <HeaderContainer>
      <TextContainer>
        <MainText
          color={isActive ? BLACK : GRAY.DARK}
          size={SIZE.SMALL}
          fontWeight={600}
        >
          {getTranslatedAttendanceInformationColumn(
            t,
            item.id as WORSHIP_ATTENDANCE
          )}
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

export default AttendanceInformationInformationTableHeader;
