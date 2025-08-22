import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MainText } from '@/components/atoms/common/text/main-text';
import { BLACK, GRAY, MAIN, RED } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';
import { getTranslatedAttendanceColumn } from '@/utils/translate';
import { useI18n } from '../../../../../locales/client';
import { WORSHIP_ENROLLMENT } from '@/constants/column/worship-column';
import { EDUCATION_TABLE_HEADER_ITEM } from '@/redux/reducers/filter/worship-enrollment-filter-reducer';
import Arrow from '../../../../../public/svg/arror-up.svg';
import ArrowUpDown from '../../../../../public/svg/arrow-up-down.svg';
import { ORDER_DIRECTION } from '@/constants/constant';
import CustomTooltip from '@/components/atoms/common/tooltip/custom-tooltip';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  gap: 10px;
  position: relative;
`;

const TextContainer = styled.div<{ $isSession?: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 3px;
  width: 100%;
  justify-content: ${({ $isSession }) => $isSession && 'center'};}
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

type TaskTableHeaderProps = {
  item: EDUCATION_TABLE_HEADER_ITEM;
  onClick: (
    id: WORSHIP_ENROLLMENT | string,
    isSession: boolean,
    sessionDate?: Date
  ) => void;
  isCheckDone?: boolean;
};

const AttendanceTableHeader = ({
  item,
  onClick,
  isCheckDone,
}: TaskTableHeaderProps) => {
  const { worshipEnrollmentOrderBy, worshipEnrollmentOrderDirection } =
    useSelector((state: RootState) => state.worshipEnrollmentFilter);
  const t = useI18n();
  const isActive = worshipEnrollmentOrderBy === item.id;

  return (
    <CustomTooltip
      text={t('tooltip.worshipAttendanceHeader')}
      disabled={!!isCheckDone}
    >
      <HeaderContainer
        onClick={() => onClick(item.id, item.isSession, item?.date)}
      >
        <TextContainer $isSession={item.isSession}>
          <MainText
            color={isActive ? BLACK : GRAY.DARK}
            size={SIZE.SMALL}
            fontWeight={600}
          >
            {item.isSession
              ? item.title
              : getTranslatedAttendanceColumn(t, item.id as WORSHIP_ENROLLMENT)}
          </MainText>
          {item.isSession && item.date && !isCheckDone && (
            <MainText color={RED.DEFAULT}>{'!'}</MainText>
          )}
        </TextContainer>
        {item.isSortable && (
          <IconContainer>
            {worshipEnrollmentOrderBy !== item.id ? (
              <ArrowUpDownIcon />
            ) : worshipEnrollmentOrderDirection === ORDER_DIRECTION.ASC ? (
              <ArrowUp />
            ) : (
              <ArrowDown />
            )}
          </IconContainer>
        )}
      </HeaderContainer>
    </CustomTooltip>
  );
};

export default AttendanceTableHeader;
