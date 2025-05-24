import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEducationSessionStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getFormattedDate } from '@/utils/format';
import { GRAY } from '@/constants/styles/color';
import React from 'react';
import Image from 'next/image';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { EducationAttendance } from '@/models/education/education';
import { useI18n } from '../../../../../../locales/client';

import { EDUCATION_SESSION_STATUS } from '@/constants/status/status';
import EducationAttendanceList from '@/components/atoms/education/education-attendance/education-attendance-list';

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

const AttendanceContainer = styled.div`
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

type EducationSessionInformationViewProps = {
  onChangeStatus: (status: EDUCATION_SESSION_STATUS) => void;
  onChangeAttendanceStatus: (
    value: boolean,
    attendance: EducationAttendance
  ) => void;
};

const EducationSessionInformationView = ({
  onChangeStatus,
  onChangeAttendanceStatus,
}: EducationSessionInformationViewProps) => {
  const t = useI18n();
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );
  const statusDropdownItems = useEducationSessionStatusDropdownItems();

  return (
    <InformationContainer>
      <MetaContainer>
        {/* 진행 상태 */}
        <ColumnContainer>
          <MainText>{t('status')}</MainText>
          <StatusDropdown
            value={targetEducationSession.status}
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
              {/*<ProfileImage*/}
              {/*  src={getRandomImage(targetEducationSession.inCharge.id)}*/}
              {/*  alt={MEMBER.PROFILE_IMAGE}*/}
              {/*/>*/}
              {/*<MainText>{targetEducationSession.inCharge?.name}</MainText>*/}
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
              {targetEducationSession.startDate &&
                getFormattedDate(targetEducationSession.startDate)}
            </MainText>
            <MainText>{'-'}</MainText>
            <MainText>
              {targetEducationSession.endDate &&
                getFormattedDate(targetEducationSession.endDate)}
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
              dangerouslySetInnerHTML={{
                __html: targetEducationSession.content,
              }}
            />
          </ContentContainer>
        </RowContainer>
      </MetaContainer>
      <DivideLine />
      <AttendanceContainer>
        <LabelContainer>
          <MainText>{`${t('attendance')}`}</MainText>
          <EducationAttendanceList
            attendances={targetEducationSession.educationAttendances}
            onChangeStatus={onChangeAttendanceStatus}
          />
        </LabelContainer>
      </AttendanceContainer>
    </InformationContainer>
  );
};

export default EducationSessionInformationView;
