import React, { useState } from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import {
  DEFAULT_EDUCATION_SESSION,
  EducationEnrollment,
  EducationSession,
  EducationTerm,
} from '@/models/management/management';
import EnrollmentTable from '@/components/molecules/management/education/enrollment-table';
import TermProcess from '@/components/atoms/management/education/term-process';
import { EDUCATION_TERM_HEADER_ID } from '@/constants/layout/header';
import AddEnrollmentModal from '@/components/atoms/modal/add-enrollment-modal';

import Plus from '../../../../../public/svg/plus.svg';
import { useI18n } from '../../../../../locales/client';

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

const PlusButton = styled(Plus)`
  stroke: ${GRAY.DARK};
  stroke-width: 2px;
  width: 25px;
  height: 25px;
  position: absolute;
  right: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const ModalContainer = styled.div`
  display: flex;
  position: absolute;
  right: 20px;
  top: 50px;
  z-index: 100;
`;

export type TermInformationContentProps = {
  term: EducationTerm;
  selectedSessionId: string;
  enrollments: EducationEnrollment[];
  sessions: EducationSession[];
  fetchEnrollments: () => void;
};

const TermInformationContent = ({
  term,
  selectedSessionId,
  enrollments,
  sessions,
  fetchEnrollments,
}: TermInformationContentProps) => {
  const t = useI18n();

  // 교육에 교인 다중 추가를 위한 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  // 교인 추가 모달 열기
  const onClickModalOpen = () => {
    setIsModalShown(true);
  };

  // 교인 추가 모달 닫기
  const onClickModalClose = () => {
    setIsModalShown(false);
  };

  return (
    <InformationContent>
      {/* 진행 사항 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('educationProcess')}</MainText>
      </ListTypeHeader>
      <TermProcess
        term={term}
        isInformation={
          selectedSessionId === EDUCATION_TERM_HEADER_ID.INFORMATION
        }
        session={
          sessions.find((session) => session.id === selectedSessionId) ||
          DEFAULT_EDUCATION_SESSION
        }
      />
      {/* 등록 정보 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('people')}</MainText>

        <PlusButton onClick={onClickModalOpen} />
        <ModalContainer>
          <AddEnrollmentModal
            term={term}
            enrollments={enrollments}
            isShown={isModalShown}
            onClickClose={onClickModalClose}
            fetchEnrollments={fetchEnrollments}
          />
        </ModalContainer>
      </ListTypeHeader>
      <EnrollmentTable
        enrollments={enrollments}
        isInformation={
          selectedSessionId === EDUCATION_TERM_HEADER_ID.INFORMATION
        }
      />
    </InformationContent>
  );
};

export default TermInformationContent;
