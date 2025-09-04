import styled from 'styled-components';
import { GRAY, GREEN, MAIN } from '@mokjang/constants';
import { EducationHistory } from '@mokjang/models';
import { SvgIcon } from '@mokjang/components';
import { MainText } from '@mokjang/components';
import { useI18n } from '../../../../../locales/client';
import { SIZE } from '@mokjang/constants';
import { getDateFromDateString, getDateStringFromDate } from '@mokjang/utils';
import React from 'react';
import { Svg } from '@mokjang/assets';

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
          <SvgIcon svg={Svg.Clock} color={MAIN.DARK} size={18} />
        </IconContainer>
        <MainText size={SIZE.LARGE} fontWeight={600}>
          {history.educationTerm.educationName}
        </MainText>
      </RowContainer>
      <RowContainer>
        <SvgIcon svg={Svg.Calendar} color={GRAY.SEMI_DARK} />
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
