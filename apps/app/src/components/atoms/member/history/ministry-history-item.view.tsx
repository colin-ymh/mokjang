import styled from 'styled-components';
import { BLACK, GRAY, GREEN, MAIN } from '@mokjang/constants';
import { MinistryDetailHistory, MinistryHistory } from '@mokjang/models';
import { SvgIcon } from '@mokjang/components';
import { MainText } from '@mokjang/components';
import { useI18n } from '../../../../../locales/client';
import { SIZE } from '@mokjang/constants';
import { getDateFromDateString, getDateStringFromDate } from '@mokjang/utils';
import React from 'react';
import { Chevron } from '../../common/dropdown/dropdown-chevron';
import { MainTag } from '@mokjang/components';
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

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background-color: ${MAIN.DEFAULT};
`;

const EditButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  right: 30px;
  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

type MinistryHistoryItemProps = {
  history: MinistryHistory;
  isOpened: boolean;
  onClickDetail: () => void;
  details: MinistryDetailHistory[] | undefined;
  onClickMinistryOpen: (history: MinistryHistory) => void;
  onClickDetailOpen: (
    history: MinistryDetailHistory,
    group: MinistryHistory
  ) => void;
};

const MinistryHistoryItem = ({
  history,
  isOpened,
  onClickDetail,
  details,
  onClickMinistryOpen,
  onClickDetailOpen,
}: MinistryHistoryItemProps) => {
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
          {history.ministryGroupSnapShot}
        </MainText>

        {history.endDate && (
          <EditButtonContainer onClick={() => onClickMinistryOpen(history)}>
            <SvgIcon
              svg={Svg.Pencil}
              size={15}
              width={1}
              color={BLACK}
              onClick={() => onClickMinistryOpen(history)}
            />
          </EditButtonContainer>
        )}
        <Chevron $isOpened={isOpened} onClick={onClickDetail} />
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

      {isOpened && details && details?.length > 0 && (
        <DetailContainer>
          <RowLine />
          <MainText color={GRAY.SEMI_DARK}>
            {t('ministryDetailHistory')}
          </MainText>
          {details.map((detail) => (
            <DetailItem key={detail.id}>
              <Dot />
              <DetailContent>
                <RowContainer>
                  <MainText>{t('ministryGroupLeader')}</MainText>
                  <MainTag title={t('editMinistryGroupLeader')} />
                </RowContainer>
                <RowContainer>
                  <MainText color={GRAY.SEMI_DARK}>{t('period')}</MainText>
                  <MainText color={GRAY.SEMI_DARK}>
                    {getDateStringFromDate(
                      getDateFromDateString(detail.startDate)
                    )}
                  </MainText>
                  <MainText color={GRAY.SEMI_DARK}>-</MainText>
                  <MainText color={GRAY.SEMI_DARK}>
                    {detail.endDate
                      ? getDateStringFromDate(
                          getDateFromDateString(detail.endDate)
                        )
                      : t('current')}
                  </MainText>
                </RowContainer>
              </DetailContent>

              <EditButtonContainer
                onClick={() => onClickDetailOpen(detail, history)}
              >
                <SvgIcon
                  svg={Svg.Pencil}
                  size={15}
                  width={1}
                  color={BLACK}
                  onClick={() => onClickDetailOpen(detail, history)}
                />
              </EditButtonContainer>
            </DetailItem>
          ))}
        </DetailContainer>
      )}
    </HistoryItemContainer>
  );
};

export default MinistryHistoryItem;
