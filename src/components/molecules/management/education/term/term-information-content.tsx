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
import EnrollmentTable from '@/components/atoms/management/education/term/enrollment-table';
import TermProcess from '@/components/molecules/management/education/term/term-process';
import { EDUCATION_TERM_HEADER_ID } from '@/constants/layout/header';
import AddEnrollmentModal from '@/components/atoms/common/modal/add-enrollment-modal';

import Plus from '../../../../../../public/svg/plus.svg';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';

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
  background-color: ${GRAY.LIGHT};
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
    background-color: ${GRAY.SEMI_LIGHT};
  }
`;

const ModalContainer = styled.div`
  display: flex;
  position: absolute;
  right: 50px;
  top: -100px;
  z-index: 100;
`;

export type TermInformationContentProps = {
  term: EducationTerm;
  educationId: string;
  selectedSessionId: string;
  enrollments: EducationEnrollment[];
  sessions: EducationSession[];
  fetchTerms: () => void;
  fetchEnrollments: () => void;
  onClickItem: (isSession: boolean) => void;
};

const TermInformationContent = ({
  term,
  educationId,
  selectedSessionId,
  enrollments,
  sessions,
  fetchEnrollments,
  fetchTerms,
  onClickItem,
}: TermInformationContentProps) => {
  const t = useI18n();
  const t_popup = useScopedI18n('popup');

  const [isToastShown, setIsToastShown] = useState<boolean>(false);

  // 기수 정보인지 회차 정보인지
  const isInformation =
    selectedSessionId === EDUCATION_TERM_HEADER_ID.INFORMATION;

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
      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={t_popup('saveComplete')}
        />
      )}
      {/* 진행 사항 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('educationProcess')}</MainText>
      </ListTypeHeader>
      <TermProcess
        term={term}
        isInformation={isInformation}
        session={
          sessions.find((session) => session.id === selectedSessionId) ||
          DEFAULT_EDUCATION_SESSION
        }
        onClickItem={onClickItem}
      />
      {/* 등록 정보 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>
          {`${isInformation ? t('people') : t('attendance')} (${enrollments.length})`}
        </MainText>
        {isInformation && <PlusButton onClick={onClickModalOpen} />}
        <ModalContainer>
          <AddEnrollmentModal
            term={term}
            enrollments={enrollments}
            isShown={isModalShown}
            onClickClose={onClickModalClose}
            fetchTerms={fetchTerms}
            setIsToastShown={setIsToastShown}
          />
        </ModalContainer>
      </ListTypeHeader>
      {/* 등록된 교인 목록 */}
      <EnrollmentTable
        term={term}
        enrollments={enrollments}
        educationId={educationId}
        sessionId={selectedSessionId}
        fetchEnrollments={fetchEnrollments}
        isInformation={
          selectedSessionId === EDUCATION_TERM_HEADER_ID.INFORMATION
        }
      />
    </InformationContent>
  );
};

export default TermInformationContent;
