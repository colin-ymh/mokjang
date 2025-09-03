import styled from 'styled-components';
import { GRAY, GREEN, MAIN } from '../../../../constants/styles/color';
import { EducationHistory } from '../../../../models/member/history';
import Clock from '../../../../../public/svg/clock.svg';
import Calendar from '../../../../../public/svg/calendar.svg';
import SvgIcon from '../../common/icon/svg-icon';
import { MainText } from '../../common/text/main-text';
import { useI18n } from '../../../../../locales/client';
import { SIZE } from '../../../../constants/styles/style';
import {
  getDateFromDateString,
  getDateStringFromDate,
} from '../../../../utils/date';
import React from 'react';

const HistoryItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 10px;
  gap: 20px;
  border: 1px solid ${GRAY.LIGHT};
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  position: relative;
`;

const IconContainer = styled.div<{ $isCurrent?: boolean }>`
  display: flex;
  padding: 10px;
  background-color: ${({ $isCurrent }) =>
    $isCurrent ? GREEN.LIGHT : MAIN.LIGHT};
  border-radius: 100%;
`;

type EducationHistoryItemProps = {
  history: EducationHistory;
};

const EducationHistoryItem = ({ history }: EducationHistoryItemProps) => {
  const t = useI18n();

  return (
    <HistoryItemContainer>
      <RowContainer>
        <IconContainer>
          <SvgIcon svg={Clock} color={MAIN.DARK} size={18} />
        </IconContainer>
        <MainText size={SIZE.LARGE} fontWeight={600}>
          {history.educationTerm.educationName}
        </MainText>
      </RowContainer>
      <RowContainer>
        <SvgIcon svg={Calendar} color={GRAY.SEMI_DARK} />
        <MainText color={GRAY.SEMI_DARK}>{t('period')}</MainText>
        <MainText color={GRAY.SEMI_DARK}>
          {getDateStringFromDate(
            getDateFromDateString(history.educationTerm.startDate)
          )}
        </MainText>
        <MainText color={GRAY.SEMI_DARK}>-</MainText>
        <MainText color={GRAY.SEMI_DARK}>
          {history.educationTerm.endDate
            ? getDateStringFromDate(
                getDateFromDateString(history.educationTerm.endDate)
              )
            : t('current')}
        </MainText>
      </RowContainer>
    </HistoryItemContainer>
  );
};

export default EducationHistoryItem;
