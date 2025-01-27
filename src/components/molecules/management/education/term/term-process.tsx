import React from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { getLocaleDateFromDashDate } from '@/utils/format';
import {
  EducationSession,
  EducationTerm,
} from '@/models/management/management';

import { useI18n } from '../../../../../../locales/client';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';

const ProcessContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;
  padding: 10px 20px;
  border-bottom: 1px solid ${GRAY.LIGHT};
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

type TermProcessProps = {
  isInformation: boolean;
  term: EducationTerm;
  session: EducationSession;
  onClickItem: (isSession: boolean) => void;
};

const TermProcess = ({
  isInformation,
  term,
  session,
  onClickItem,
}: TermProcessProps) => {
  const t = useI18n();
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  return isInformation ? (
    <ProcessContainer>
      <RowContainer>
        {/* 기수 */}
        <InformationItem onClick={() => onClickItem(false)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{t('term')}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{term.term}</MainText>
          </ContentContainer>
        </InformationItem>

        {/* 총 회차 */}
        <InformationItem onClick={() => onClickItem(false)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>
              {`${t('total')} ${t('session')}`}
            </MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{term.numberOfSessions}</MainText>
          </ContentContainer>
        </InformationItem>
      </RowContainer>
      <RowContainer>
        {/* 진행자 */}
        <InformationItem onClick={() => onClickItem(false)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{t('instructor')}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{term?.instructor?.name}</MainText>
          </ContentContainer>
        </InformationItem>
        {/* 교육 기간 */}
        <InformationItem onClick={() => onClickItem(false)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{t('period')}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{`${getLocaleDateFromDashDate(
              basePath,
              term.startDate
            )} - ${getLocaleDateFromDashDate(basePath, term.endDate)}`}</MainText>
          </ContentContainer>
        </InformationItem>
      </RowContainer>
    </ProcessContainer>
  ) : (
    <ProcessContainer>
      <RowContainer>
        {/* 교육 일시 */}
        <InformationItem onClick={() => onClickItem(true)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{t('educationDate')}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{}</MainText>
          </ContentContainer>
        </InformationItem>
        {/* 인원 수 */}
        <InformationItem onClick={() => onClickItem(true)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{t('people')}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{term.enrollmentCount}</MainText>
          </ContentContainer>
        </InformationItem>
      </RowContainer>
      <RowContainer>
        {/* 회차 보고 */}
        <InformationItem onClick={() => onClickItem(true)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{t('sessionContent')}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{session.content}</MainText>
          </ContentContainer>
        </InformationItem>
      </RowContainer>
    </ProcessContainer>
  );
};

export default TermProcess;
