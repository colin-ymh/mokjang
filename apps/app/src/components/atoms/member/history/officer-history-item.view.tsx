import styled from 'styled-components';
import { GRAY, LOCALE, MAIN, SIZE, WHITE } from '@mokjang/constants';
import { OfficerHistory } from '@mokjang/models';
import { Button, MainText } from '@mokjang/components';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { getTranslatedDateFromDateString } from '@mokjang/utils';
import React from 'react';
import { usePathname } from 'next/navigation';

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

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
`;

const EditButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  right: 0;
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
  const t_button = useScopedI18n('button');

  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  return (
    <HistoryItemContainer>
      <RowContainer>
        <ColumnContainer>
          <MainText size={SIZE.LARGE} fontWeight={600}>
            {history.officerSnapShot}
          </MainText>
          <MainText color={GRAY.SEMI_DARK}>
            {`${getTranslatedDateFromDateString(locale, history.startDate)} - ${
              history.endDate
                ? getTranslatedDateFromDateString(locale, history.endDate)
                : t('current')
            }`}
          </MainText>
        </ColumnContainer>

        {history.endDate && (
          <EditButtonContainer>
            <Button
              width={'auto'}
              text={t_button('edit')}
              borderColor={MAIN.LIGHT}
              backgroundColor={WHITE}
              color={MAIN.DEFAULT}
              height={30}
              onClick={() => onClickOfficerOpen(history)}
            />
          </EditButtonContainer>
        )}
      </RowContainer>
    </HistoryItemContainer>
  );
};

export default OfficerHistoryItem;
