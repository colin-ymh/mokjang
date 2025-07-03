import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n } from '../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import React from 'react';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';

const InformationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
`;

const MetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px 20px 50px 20px;
  gap: 30px;
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

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

const CommentContentContainer = styled.div`
  display: flex;
  padding: 10px;
  min-height: 50px;
`;

type WorshipSessionInformationViewProps = {};

const WorshipSessionInformationView =
  ({}: WorshipSessionInformationViewProps) => {
    const t = useI18n();

    const { targetWorshipSession } = useSelector(
      (state: RootState) => state.targetWorshipSession
    );
    return (
      <InformationContainer>
        <MetaContainer>
          {/* 제목 */}
          <RowContainer>
            <TitleContainer>
              <MainText>{t('worshipSessionTitle')}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{targetWorshipSession.title}</MainText>
            </ContentContainer>
          </RowContainer>
          {/* 성경 본문 */}
          <RowContainer>
            <TitleContainer>
              <MainText>{t('worshipSessionBibleTitle')}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{targetWorshipSession.bibleTitle}</MainText>
            </ContentContainer>
          </RowContainer>
          {/* 예배 영상 url */}
          <RowContainer>
            <TitleContainer>
              <MainText>{t('worshipSessionVideoUrl')}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{targetWorshipSession.videoUrl}</MainText>
            </ContentContainer>
          </RowContainer>
          {/* 진행자 */}
          <RowContainer>
            <TitleContainer>
              <MainText>{t('worshipSessionInCharge')}</MainText>
            </TitleContainer>
            <ContentContainer>
              {targetWorshipSession.inCharge && (
                <MemberProfilePopupButton
                  key={targetWorshipSession.inCharge?.id}
                  member={targetWorshipSession.inCharge}
                />
              )}
            </ContentContainer>
          </RowContainer>
        </MetaContainer>
        <CommentContainer>
          {/* 특이사항 */}
          <ColumnContainer>
            <TitleContainer>
              <MainText>{t('worshipSessionDescription')}</MainText>
            </TitleContainer>
            <CommentContentContainer>
              <MainText
                dangerouslySetInnerHTML={{
                  __html: targetWorshipSession.description,
                }}
              />
            </CommentContentContainer>
          </ColumnContainer>
        </CommentContainer>
      </InformationContainer>
    );
  };

export default WorshipSessionInformationView;
