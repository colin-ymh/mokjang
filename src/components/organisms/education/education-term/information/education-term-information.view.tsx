import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEducationTermStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getFormattedDate } from '@/utils/format';
import { GRAY } from '@/constants/styles/color';
import { getRandomImage } from '@/utils/image';
import { MEMBER } from '@/constants/member/member-column';
import React from 'react';
import Image from 'next/image';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import {
  EDUCATION_TERM_STATUS,
  EducationEnrollment,
} from '@/models/education/education';
import EducationEnrollmentList from '@/components/atoms/education/education-enrollment/education-enrollment-list';
import { useI18n } from '../../../../../../locales/client';
import EducationTermSessionList from '@/components/molecules/education/education-term/education-term-session-list';
import { EDUCATION_STATUS } from '@/constants/constant';

const InformationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
`;

const MetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px 20px;
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

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EnrollmentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

const LabelContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

type EducationTermInformationViewProps = {
  onChangeStatus: (status: EDUCATION_TERM_STATUS) => void;
  onChangeEnrollmentStatus: (
    value: EDUCATION_STATUS,
    enrollment: EducationEnrollment
  ) => void;
};

const EducationTermInformationView = ({
  onChangeStatus,
  onChangeEnrollmentStatus,
}: EducationTermInformationViewProps) => {
  const t = useI18n();
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const statusDropdownItems = useEducationTermStatusDropdownItems();

  return (
    <InformationContainer>
      <MetaContainer>
        {/* 진행 상태 */}
        <ColumnContainer>
          <MainText>{t('status')}</MainText>
          <StatusDropdown
            value={targetEducationTerm.status}
            items={statusDropdownItems}
            onChangeItem={onChangeStatus}
            width={150}
            height={40}
          />
        </ColumnContainer>

        {/* 진행자 */}
        <RowContainer>
          <TitleContainer>
            <MainText>{t('inCharge')}</MainText>
          </TitleContainer>
          <ContentContainer>
            <ProfileContainer>
              <ProfileImage
                src={getRandomImage(targetEducationTerm.inCharge.id)}
                alt={MEMBER.PROFILE_IMAGE}
              />
              <MainText>{targetEducationTerm.inCharge?.name}</MainText>
            </ProfileContainer>
          </ContentContainer>
        </RowContainer>
        {/* 일자 */}
        <RowContainer>
          <TitleContainer>
            <MainText>{t('period')}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>
              {targetEducationTerm.startDate &&
                getFormattedDate(targetEducationTerm.startDate)}
            </MainText>
            <MainText>{'-'}</MainText>
            <MainText>
              {targetEducationTerm.endDate &&
                getFormattedDate(targetEducationTerm.endDate)}
            </MainText>
          </ContentContainer>
        </RowContainer>
        {/* 내용 */}
        <RowContainer>
          <TitleContainer>
            <MainText>{t('content')}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText
              dangerouslySetInnerHTML={{ __html: targetEducationTerm.content }}
            />
          </ContentContainer>
        </RowContainer>
      </MetaContainer>
      {/* 회차 */}
      <EducationTermSessionList
        educationSessions={targetEducationTerm.educationSessions}
        onClickAddButton={() => {}}
      />
      <DivideLine />
      <EnrollmentContainer>
        <LabelContainer>
          <MainText>{`수강 교인 (${targetEducationTerm.enrollmentCount})`}</MainText>
          <EducationEnrollmentList
            enrollments={targetEducationTerm.educationEnrollments}
            onChangeStatus={onChangeEnrollmentStatus}
          />
        </LabelContainer>
      </EnrollmentContainer>
    </InformationContainer>
  );
};

export default EducationTermInformationView;
