import React from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { EducationTerm } from '@/models/management/management';

import { useI18n } from '../../../../../locales/client';
import { getKRDateFromDashDate } from '@/utils/format';
import EnrollmentTable from '@/components/molecules/management/education/enrollment-table';

const InformationContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const ListTypeHeader = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  height: 40px;
  background-color: ${GRAY.SIDE_BAR};
  justify-content: flex-start;
  align-items: center;
  padding: 0 20px;
`;

const ProcessContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;
  padding: 10px 20px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const InformationItem = styled.div`
  flex: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const TitleContainer = styled.div`
  display: flex;
  width: 150px;
`;

export type TermInformationContentProps = {
  term: EducationTerm;
  selectedSessionId: string;
};

const TermInformationContent = ({
  term,
  selectedSessionId,
}: TermInformationContentProps) => {
  const t = useI18n();
  return (
    <InformationContent>
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('educationProcess')}</MainText>
      </ListTypeHeader>
      <ProcessContainer>
        <RowContainer>
          {/* 기수 */}
          <InformationItem>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{`${t('term')}`}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{term.term}</MainText>
            </ContentContainer>
          </InformationItem>
          {/* 총 회차 */}
          <InformationItem>
            <TitleContainer>
              <MainText
                color={GRAY.DEFAULT}
              >{`${t('total')} ${t('session')}`}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{term.numberOfSessions}</MainText>
            </ContentContainer>
          </InformationItem>
          {/* 교육 기간 */}
          <InformationItem>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{`${t('period')}`}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{`${getKRDateFromDashDate(term.startDate)} - ${getKRDateFromDashDate(term.endDate)}`}</MainText>
            </ContentContainer>
          </InformationItem>
        </RowContainer>
        <RowContainer>
          {/* 진행자 */}
          <InformationItem>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{`${t('instructor')}`}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{term?.instructor?.name}</MainText>
            </ContentContainer>
          </InformationItem>
          {/* 인원 수 */}
          <InformationItem>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{`${t('people')}`}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{term.enrollmentCount}</MainText>
            </ContentContainer>
          </InformationItem>
        </RowContainer>
      </ProcessContainer>
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('people')}</MainText>
      </ListTypeHeader>
      <EnrollmentTable enrollments={term.educationEnrollments} />
    </InformationContent>
  );
};

export default TermInformationContent;
