import styled from 'styled-components';
import { GRAY, LOCALE, MAIN, SIZE, WHITE } from '@mokjang/constants';
import { GroupDetailHistory, GroupHistory } from '@mokjang/models';
import { Button, MainText } from '@mokjang/components';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { getTranslatedDateFromDateString } from '@mokjang/utils';
import React from 'react';
import { Chevron } from '../../common/dropdown/dropdown-chevron';
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
  position: relative;
  gap: 15px;
`;

const DetailContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
`;

const RowLine = styled.div`
  display: flex;
  width: 100%;
  height: 0.6px;
  background-color: ${GRAY.LIGHT};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  background-color: ${GRAY.SUPER_LIGHT};
  position: relative;
`;

const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EditButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  right: 30px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
`;

type GroupHistoryItemProps = {
  history: GroupHistory;
  isOpened: boolean;
  onClickDetail: () => void;
  details: GroupDetailHistory[] | undefined;
  onClickGroupOpen: (history: GroupHistory) => void;
  onClickDetailOpen: (history: GroupDetailHistory) => void;
};

const GroupHistoryItem = ({
  history,
  isOpened,
  onClickDetail,
  details,
  onClickGroupOpen,
  onClickDetailOpen,
}: GroupHistoryItemProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');

  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  return (
    <HistoryItemContainer>
      <RowContainer>
        <ColumnContainer>
          <MainText size={SIZE.LARGE} fontWeight={600}>
            {history.groupSnapShot}
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
              onClick={() => onClickGroupOpen(history)}
            />
          </EditButtonContainer>
        )}
        <Chevron $isOpened={isOpened} onClick={onClickDetail} />
      </RowContainer>

      {isOpened && details && details?.length > 0 && (
        <DetailContainer>
          <RowLine />
          <MainText color={GRAY.SEMI_DARK}>{t('groupDetailHistory')}</MainText>
          {details.map((detail) => (
            <DetailItem key={detail.id}>
              <DetailContent>
                <MainText>{t('groupLeader')}</MainText>
                <MainText color={GRAY.SEMI_DARK}>
                  {`${getTranslatedDateFromDateString(locale, detail.startDate)} - ${
                    detail.endDate
                      ? getTranslatedDateFromDateString(locale, detail.endDate)
                      : t('current')
                  }`}
                </MainText>
              </DetailContent>

              {detail.endDate && (
                <EditButtonContainer>
                  <Button
                    width={'auto'}
                    text={t_button('edit')}
                    borderColor={MAIN.LIGHT}
                    backgroundColor={WHITE}
                    color={MAIN.DEFAULT}
                    height={30}
                    onClick={() => onClickDetailOpen(detail)}
                  />
                </EditButtonContainer>
              )}
            </DetailItem>
          ))}
        </DetailContainer>
      )}
    </HistoryItemContainer>
  );
};

export default GroupHistoryItem;
