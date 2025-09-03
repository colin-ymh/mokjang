import styled from 'styled-components';
import { BLACK, GRAY, GREEN, MAIN } from '@mokjang/constants';
import { OfficerHistory } from '@mokjang/models';
import { Svg } from '@mokjang/assets';
import { SvgIcon } from '@mokjang/components';
import { MainText } from '@mokjang/components';
import { useI18n } from '../../../../../locales/client';
import { SIZE } from '@mokjang/constants';
import { getDateFromDateString, getDateStringFromDate } from '@mokjang/utils';
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

const EditButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  right: 0;
  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

type OfficerHistoryItemProps = {
  history: OfficerHistory;
  onClickOfficerOpen: (history: OfficerHistory) => void;
};

const OfficerHistoryItem = ({
  history,
  onClickOfficerOpen,
}: OfficerHistoryItemProps) => {
  const t = useI18n();

  return (
    <HistoryItemContainer>
      <RowContainer>
        <IconContainer $isCurrent={!history.endDate}>
          <SvgIcon
            svg={Svg.Clock}
            color={history.endDate ? MAIN.DARK : GREEN.DARK}
            size={18}
          />
        </IconContainer>
        <MainText size={SIZE.LARGE} fontWeight={600}>
          {history.officerSnapShot}
        </MainText>

        {history.endDate && (
          <EditButtonContainer onClick={() => onClickOfficerOpen(history)}>
            <SvgIcon
              svg={Svg.Pencil}
              size={15}
              width={1}
              color={BLACK}
              onClick={() => onClickOfficerOpen(history)}
            />
          </EditButtonContainer>
        )}
      </RowContainer>
      <RowContainer>
        <SvgIcon svg={Svg.Calendar} color={GRAY.SEMI_DARK} />
        <MainText color={GRAY.SEMI_DARK}>{t('period')}</MainText>
        <MainText color={GRAY.SEMI_DARK}>
          {getDateStringFromDate(getDateFromDateString(history.startDate))}
        </MainText>
        <MainText color={GRAY.SEMI_DARK}>-</MainText>
        <MainText color={GRAY.SEMI_DARK}>
          {history.endDate
            ? getDateStringFromDate(getDateFromDateString(history.endDate))
            : t('current')}
        </MainText>
      </RowContainer>
    </HistoryItemContainer>
  );
};

export default OfficerHistoryItem;
