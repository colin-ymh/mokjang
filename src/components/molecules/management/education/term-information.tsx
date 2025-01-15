import { useState } from 'react';

import TermInformationView from '@/components/molecules/management/education/term-information.view';
import {
  Education,
  EducationEnrollment,
  EducationSession,
  EducationTerm,
} from '@/models/management/management';
import { EDUCATION_TERM_HEADER_ID } from '@/constants/layout/header';

type TermInformationProps = {
  education: Education;
  term: EducationTerm;
  enrollments: EducationEnrollment[];
  sessions: EducationSession[];
  fetchEnrollments: () => void;
};

const TermInformation = ({
  education,
  term,
  enrollments,
  sessions,
  fetchEnrollments,
}: TermInformationProps) => {
  // 선택된 회차
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    EDUCATION_TERM_HEADER_ID.INFORMATION
  );

  // 회차 선택
  const onClickHeaderItem = (id: string) => {
    setSelectedSessionId(id);
  };

  const props = {
    header: {
      education,
      term,
      selectedSessionId,
      onClickHeaderItem,
    },
    content: {
      term,
      selectedSessionId,
      enrollments,
      sessions,
      fetchEnrollments,
    },
  };

  return (
    <>
      <TermInformationView {...props} />
    </>
  );
};

export default TermInformation;
