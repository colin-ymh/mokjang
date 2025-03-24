import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import TermTableView from '@/components/atoms/management/education/term-table.view';
import {
  DEFAULT_EDUCATION_TERM,
  Education,
  EducationEnrollment,
  EducationSession,
  EducationTerm,
} from '@/models/management/management';
import { EDUCATION_TERM } from '@/constants/management/education-term-column';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import TermInformation from '@/components/organisms/management/education/term/term-information';
import { EducationEnrollmentsApi } from '@/api/management/education/education-enrollments.api';
import { EducationSessionsApi } from '@/api/management/education/education-sessions.api';

export type TermTableProps = {
  education: Education;
  terms: EducationTerm[];
  fetchTerms: () => void;
};

const TermTable = ({ education, terms, fetchTerms }: TermTableProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);
  const educationSessionsApi = new EducationSessionsApi(false);

  // 상세 모달 활성화 여부
  const [isDetailModalShown, setIsDetailModalShown] = useState<boolean>(false);

  // 선택된 기수
  const [selectedTerm, setSelectedTerm] = useState<EducationTerm>(
    DEFAULT_EDUCATION_TERM
  );

  // 등록
  const [enrollments, setEnrollments] = useState<EducationEnrollment[]>([]);

  // 회차
  const [sessions, setSessions] = useState<EducationSession[]>([]);

  // 기수 클릭 시 이벤트
  const onClickTerm = (term: EducationTerm) => {
    setIsDetailModalShown(true);
    setSelectedTerm(term);
  };

  // 모달 닫기
  const onClickClose = () => {
    setSelectedTerm(DEFAULT_EDUCATION_TERM);
    setEnrollments([]);
    setSessions([]);
    setIsDetailModalShown(false);
  };

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: EDUCATION_TERM) => {};

  // 스크롤 시 이벤트
  const onScroll = () => {};

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  const fetchEnrollments = () => {
    educationEnrollmentsApi
      .getEducationEnrollments({
        churchId,
        educationId: education.id,
        educationTermId: selectedTerm.id,
      })
      .then((response) => {
        setEnrollments(response.data.data);
      });
  };

  const fetchSessions = () => {
    educationSessionsApi
      .getEducationSessions({
        churchId,
        educationId: education.id,
        educationTermId: selectedTerm.id,
      })
      .then((response) => {
        setSessions(response.data);
      });
  };

  // 교육 기수 전체를 불러오며, 선택한 기수도 리렌더링
  useEffect(() => {
    if (terms) {
      const newSelectedTerm = terms.find((term) => term.id === selectedTerm.id);

      if (newSelectedTerm) {
        setSelectedTerm(newSelectedTerm);
      }
    }
  }, [terms]);

  useEffect(() => {
    if (selectedTerm.id) {
      fetchEnrollments();
      fetchSessions();
    }
  }, [selectedTerm]);

  const props = {
    terms,
    education,
    onClickTerm,
    onClickHeader,
    scrollRef,
    onScroll,
    fetchEnrollments,
  };

  return (
    <>
      <TermTableView {...props} />
      <CustomPopup
        isShow={isDetailModalShown}
        onClickClose={onClickClose}
        width={70}
        height={90}
        isPercentage={true}
      >
        <TermInformation
          education={education}
          term={selectedTerm}
          enrollments={enrollments}
          sessions={sessions}
          fetchEnrollments={fetchEnrollments}
          fetchTerms={fetchTerms}
          onClickClose={onClickClose}
        />
      </CustomPopup>
    </>
  );
};

export default TermTable;
