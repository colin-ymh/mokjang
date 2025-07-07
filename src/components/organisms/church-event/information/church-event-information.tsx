import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n } from '../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import React from 'react';
import { getDateFromDateString, getDateStringFromDate } from '@/utils/date';

const InformationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  gap: 20px;
  padding: 20px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100px;
  flex-shrink: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CommentContentContainer = styled.div`
  display: flex;
  padding: 10px;
  min-height: 50px;
`;

type ChurchEventInformationProps = {};

const ChurchEventInformation = ({}: ChurchEventInformationProps) => {
  const t = useI18n();

  const { targetChurchEvent } = useSelector(
    (state: RootState) => state.targetChurchEvent
  );

  return (
    <InformationContainer>
      {/* 제목 */}
      <RowContainer>
        <TitleContainer>
          <MainText>{t('title')}</MainText>
        </TitleContainer>
        <ContentContainer>
          <MainText>{targetChurchEvent.title}</MainText>
        </ContentContainer>
      </RowContainer>
      {/* 일자 */}
      <RowContainer>
        <TitleContainer>
          <MainText>{t('date')}</MainText>
        </TitleContainer>
        <ContentContainer>
          <MainText>
            {getDateStringFromDate(
              getDateFromDateString(targetChurchEvent.date)
            )}
          </MainText>
        </ContentContainer>
      </RowContainer>
      {/* 내용 */}
      <ColumnContainer>
        <TitleContainer>
          <MainText>{t('description')}</MainText>
        </TitleContainer>
        <CommentContentContainer>
          <MainText
            dangerouslySetInnerHTML={{
              __html: targetChurchEvent.description,
            }}
          />
        </CommentContentContainer>
      </ColumnContainer>
    </InformationContainer>
  );
};

export default ChurchEventInformation;
