import styled from 'styled-components';
import { GRAY, MAIN } from '@/constants/styles/color';
import { GroupDetailHistory, GroupHistory } from '@/models/member/history';
import Clock from '../../../../../public/svg/clock.svg';
import Calendar from '../../../../../public/svg/calendar.svg';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useI18n } from '../../../../../locales/client';
import { SIZE } from '@/constants/styles/style';
import { getDateFromDateString, getDateStringFromDate } from '@/utils/date';
import React from 'react';
import { Chevron } from '@/components/atoms/common/dropdown/dropdown-chevron';
import MainTag from '@/components/atoms/common/tag/main-tag';

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

const IconContainer = styled.div`
  display: flex;
  padding: 10px;
  background-color: ${MAIN.LIGHT};
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

type GroupHistoryItemProps = {
  history: GroupHistory;
  isOpened: boolean;
  onClickDetail: () => void;
  details: GroupDetailHistory[] | undefined;
};

const GroupHistoryItem = ({
  history,
  isOpened,
  onClickDetail,
  details,
}: GroupHistoryItemProps) => {
  const t = useI18n();

  return (
    <HistoryItemContainer>
      <RowContainer>
        <IconContainer>
          <SvgIcon svg={Clock} color={MAIN.DARK} size={18} />
        </IconContainer>
        <MainText size={SIZE.LARGE} fontWeight={600}>
          {history.groupSnapShot}
        </MainText>
        <Chevron $isOpened={isOpened} onClick={onClickDetail} />
      </RowContainer>
      <RowContainer>
        <SvgIcon svg={Calendar} color={GRAY.SEMI_DARK} />
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
          <MainText color={GRAY.SEMI_DARK}>{t('groupDetailHistory')}</MainText>
          {details.map((detail) => (
            <DetailItem key={detail.id}>
              <Dot />
              <DetailContent>
                <RowContainer>
                  <MainText>{t('groupLeader')}</MainText>
                  <MainTag title={t('editGroupLeader')} />
                </RowContainer>
                <MainText size={SIZE.SMALL} color={GRAY.DEFAULT}>
                  {getDateStringFromDate(
                    getDateFromDateString(detail.startDate)
                  )}
                </MainText>
              </DetailContent>
            </DetailItem>
          ))}
        </DetailContainer>
      )}
    </HistoryItemContainer>
  );
};

export default GroupHistoryItem;
