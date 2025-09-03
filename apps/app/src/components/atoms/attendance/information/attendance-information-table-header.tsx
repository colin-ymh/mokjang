import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import { MainText } from '@mokjang/components';
import { BLACK, GRAY, MAIN } from '@mokjang/constants';
import { SIZE } from '@mokjang/constants';
import { getTranslatedAttendanceInformationColumn } from '@mokjang/utils';
import { useI18n } from '../../../../../locales/client';
import { WORSHIP_ATTENDANCE } from '@mokjang/constants';
import { ATTENDANCE_INFORMATION_TABLE_HEADER_ITEM } from '../../../../redux/reducers/filter/worship-attendance-filter-reducer';
import { ORDER_DIRECTION } from '@mokjang/constants';
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

type AttendanceInformationTableHeaderProps = {
  item: ATTENDANCE_INFORMATION_TABLE_HEADER_ITEM;
  onClick: (id: WORSHIP_ATTENDANCE) => void;
};

const AttendanceInformationInformationTableHeader = ({
  item,
  onClick,
}: AttendanceInformationTableHeaderProps) => {
  const { worshipAttendanceSortBy, worshipAttendanceSortDirection } =
    useSelector((state: RootState) => state.worshipAttendanceFilter);
  const t = useI18n();
  const isActive = worshipAttendanceSortBy === item.id;

  return (
    <HeaderContainer onClick={() => item.isSortable && onClick(item.id)}>
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
          {worshipAttendanceSortBy !== item.id ? (
            <ArrowUpDownIcon />
          ) : worshipAttendanceSortDirection === ORDER_DIRECTION.ASC ? (
            <ArrowUp />
          ) : (
            <ArrowDown />
          )}
        </IconContainer>
      )}
    </HeaderContainer>
  );
};

export default AttendanceInformationInformationTableHeader;
