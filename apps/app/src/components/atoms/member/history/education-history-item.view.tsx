import styled from 'styled-components';
import { GRAY, LOCALE, SIZE } from '@mokjang/constants';
import { EducationHistory } from '@mokjang/models';
import { MainText } from '@mokjang/components';
import { useI18n } from '../../../../../locales/client';
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

type EducationHistoryItemProps = {
  history: EducationHistory;
};

const EducationHistoryItem = ({ history }: EducationHistoryItemProps) => {
  const t = useI18n();

  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  return (
    <HistoryItemContainer>
      <RowContainer>
        <ColumnContainer>
          <MainText size={SIZE.LARGE} fontWeight={600}>
            {history.educationTerm.educationName}
          </MainText>
          <MainText color={GRAY.SEMI_DARK}>
            {`${getTranslatedDateFromDateString(locale, history.educationTerm.startDate)} - ${
              history.educationTerm.endDate
                ? getTranslatedDateFromDateString(
                    locale,
                    history.educationTerm.endDate
                  )
                : t('current')
            }`}
          </MainText>
        </ColumnContainer>
      </RowContainer>
    </HistoryItemContainer>
  );
};

export default EducationHistoryItem;
