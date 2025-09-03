import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useI18n } from '../../../../../locales/client';
import { MainText } from '../../../atoms/common/text/main-text';
import React from 'react';
import MemberProfilePopupButton from '../../common/button/member-profile-popup-button';
import { SIZE } from '../../../../constants/styles/style';
import Button from '../../../atoms/common/button/button';
import { GRAY, MAIN } from '../../../../constants/styles/color';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const MetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100px;
  flex-shrink: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

const CommentContentContainer = styled.div`
  display: flex;
`;

type WorshipSessionInformationViewProps = {
  onClickEditOpen: () => void;
};

const WorshipSessionInformationView = ({
  onClickEditOpen,
}: WorshipSessionInformationViewProps) => {
  const t = useI18n();

  const { targetWorshipSession } = useSelector(
    (state: RootState) => state.targetWorshipSession
  );
  return (
    <InformationContainer>
      <HeaderContainer>
        <MainText size={SIZE.EXTRA_LARGE}>{t('worshipInformation')}</MainText>
        <Button
          text={t('button.addWorshipInformation')}
          width={'auto'}
          height={30}
          onClick={onClickEditOpen}
        />
      </HeaderContainer>
      <MetaContainer>
        <RowContainer>
          {/* 제목 */}
          <LabelContainer>
            <TitleContainer>
              <MainText size={SIZE.SMALL} color={GRAY.DARK}>
                {t('worshipSessionTitle')}
              </MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{targetWorshipSession.title}</MainText>
            </ContentContainer>
          </LabelContainer>
          {/* 진행자 */}
          <LabelContainer>
            <TitleContainer>
              <MainText size={SIZE.SMALL} color={GRAY.DARK}>
                {t('worshipSessionInCharge')}
              </MainText>
            </TitleContainer>
            <ContentContainer>
              {targetWorshipSession.inCharge && (
                <MemberProfilePopupButton
                  key={targetWorshipSession.inCharge?.id}
                  member={targetWorshipSession.inCharge}
                  isProfileImageShown={false}
                />
              )}
            </ContentContainer>
          </LabelContainer>
        </RowContainer>
        <RowContainer>
          {/* 성경 본문 */}
          <LabelContainer>
            <TitleContainer>
              <MainText size={SIZE.SMALL} color={GRAY.DARK}>
                {t('worshipSessionBibleTitle')}
              </MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{targetWorshipSession.bibleTitle}</MainText>
            </ContentContainer>
          </LabelContainer>
          {/* 예배 영상 url */}
          <LabelContainer>
            <TitleContainer>
              <MainText size={SIZE.SMALL} color={GRAY.DARK}>
                {t('worshipSessionVideoUrl')}
              </MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText
                as="a"
                href={targetWorshipSession.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                overflow="hidden"
                maxWidth={300}
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                textDecoration="underline"
                cursor="pointer"
                color={MAIN.DEFAULT}
              >
                {targetWorshipSession.videoUrl}
              </MainText>
            </ContentContainer>
          </LabelContainer>
        </RowContainer>

        {/* 특이사항 */}
        <LabelContainer>
          <TitleContainer>
            <MainText size={SIZE.SMALL} color={GRAY.DARK}>
              {t('worshipSessionDescription')}
            </MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText
              dangerouslySetInnerHTML={{
                __html: targetWorshipSession.description,
              }}
            />
          </ContentContainer>
        </LabelContainer>
      </MetaContainer>
    </InformationContainer>
  );
};

export default WorshipSessionInformationView;
