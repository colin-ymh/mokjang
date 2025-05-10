import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useVisitationStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { VISITATION_STATUS } from '@/models/visitation/visitation';
import { useI18n } from '../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getFormattedDate } from '@/utils/format';
import { GRAY } from '@/constants/styles/color';
import { getRandomImage } from '@/utils/image';
import { MEMBER } from '@/constants/member/member-column';
import React from 'react';
import Image from 'next/image';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';

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

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const ProfileImage = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 35%;
  overflow: hidden;
`;

const DivideLine = styled.div`
  width: 100%;
  height: 10px;
  background-color: ${GRAY.DEFAULT};
`;

const DetailList = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailContentContainer = styled.div`
  display: flex;
  padding: 10px;
  min-height: 50px;
`;

type VisitationInformationViewProps = {
  onChangeStatus: (status: VISITATION_STATUS) => void;
};

const VisitationInformationView = ({
  onChangeStatus,
}: VisitationInformationViewProps) => {
  const t = useI18n();
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );
  const statusDropdownItems = useVisitationStatusDropdownItems();

  return (
    <InformationContainer>
      <MetaContainer>
        {/* 진행 상태 */}
        <ColumnContainer>
          <MainText>{t('status')}</MainText>
          <StatusDropdown
            value={targetVisitation.visitationStatus}
            items={statusDropdownItems}
            onChangeItem={onChangeStatus}
            width={150}
            height={40}
          />
        </ColumnContainer>
        {/* 대상자 */}
        <RowContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t('visitedMember')}</MainText>
          </TitleContainer>
          <ContentContainer>
            {targetVisitation.members.map((member) => (
              <ProfileContainer>
                <ProfileImage
                  src={getRandomImage(member.id)}
                  alt={MEMBER.PROFILE_IMAGE}
                />
                <MainText>{member?.name}</MainText>
              </ProfileContainer>
            ))}
          </ContentContainer>
        </RowContainer>
        {/* 진행자 */}
        <RowContainer>
          <TitleContainer>
            <MainText>{t('instructor')}</MainText>
          </TitleContainer>
          <ContentContainer>
            <ProfileContainer>
              <ProfileImage
                src={getRandomImage(targetVisitation.instructor.id)}
                alt={MEMBER.PROFILE_IMAGE}
              />
              <MainText>{targetVisitation.instructor?.name}</MainText>
            </ProfileContainer>
          </ContentContainer>
        </RowContainer>
        {/* 방식 */}
        <RowContainer>
          <TitleContainer>
            <MainText>{t('visitationMethod')}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{t(targetVisitation.visitationMethod)}</MainText>
          </ContentContainer>
        </RowContainer>
        {/* 일자 */}
        <RowContainer>
          <TitleContainer>
            <MainText>{t('visitationDate')}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>
              {targetVisitation.visitationStartDate &&
                getFormattedDate(targetVisitation.visitationStartDate)}
            </MainText>
            <MainText>{'-'}</MainText>
            <MainText>
              {targetVisitation.visitationEndDate &&
                getFormattedDate(targetVisitation.visitationEndDate)}
            </MainText>
          </ContentContainer>
        </RowContainer>
      </MetaContainer>
      {/* 상세 */}
      <DetailList>
        {targetVisitation.visitationDetails.map((detail) => (
          <div key={detail.memberId}>
            <DivideLine />
            <DetailContainer>
              {detail.member?.name &&
                targetVisitation.visitationDetails.length !== 1 && (
                  <MainText fontWeight={600}>{detail.member.name}</MainText>
                )}
              {/* 심방내용 */}
              <ColumnContainer>
                <TitleContainer>
                  <MainText>{t('visitationContent')}</MainText>
                </TitleContainer>
                <DetailContentContainer>
                  <MainText
                    dangerouslySetInnerHTML={{
                      __html: detail.visitationContent,
                    }}
                  />
                </DetailContentContainer>
              </ColumnContainer>
              {/* 기도제목 */}
              <ColumnContainer>
                <TitleContainer>
                  <MainText>{t('visitationPray')}</MainText>
                </TitleContainer>
                <DetailContentContainer>
                  <MainText
                    dangerouslySetInnerHTML={{ __html: detail.visitationPray }}
                  />
                </DetailContentContainer>
              </ColumnContainer>
            </DetailContainer>
          </div>
        ))}
      </DetailList>
    </InformationContainer>
  );
};

export default VisitationInformationView;
