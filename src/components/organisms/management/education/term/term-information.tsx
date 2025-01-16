import { useState } from 'react';

import TermInformationView from '@/components/organisms/management/education/term/term-information.view';
import {
  Education,
  EducationEnrollment,
  EducationSession,
  EducationTerm,
} from '@/models/management/management';
import { EDUCATION_TERM_HEADER_ID } from '@/constants/layout/header';
import { EducationAttendanceApi } from '@/api/management/education/education-attendance.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

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
  const educationAttendanceApi = new EducationAttendanceApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 선택된 회차
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    EDUCATION_TERM_HEADER_ID.INFORMATION
  );

  // 회차 선택
  const onClickHeaderItem = async (id: string) => {
    try {
      if (id !== EDUCATION_TERM_HEADER_ID.INFORMATION) {
        // getAttendance가 끝난 후 setSelectedSessionId 호출
        await getAttendance(id).then(() => {
          setSelectedSessionId(id);
        });
      } else {
        setSelectedSessionId(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 특정 회차의 출석부 생성하기
  const getAttendance = async (sessionId: string) => {
    await educationAttendanceApi
      .getEducationAttendances({
        churchId,
        educationId: education.id,
        educationTermId: term.id,
        sessionId,
      })
      .then((response) => {
        // 현재 출석부
        const prevAttendance = response.data;

        // 현재 등록 인원 수와 출석부 길이를 비교
        // 다르다면, 출석부 새로 생성
        if (enrollments.length !== prevAttendance.length) {
          educationAttendanceApi.createEducationAttendances({
            churchId,
            educationId: education.id,
            educationTermId: term.id,
            sessionId,
          });
        }
      });
  };

  const props = {
    header: {
      education,
      term,
      selectedSessionId,
      sessions,
      onClickHeaderItem,
    },
    content: {
      term,
      selectedSessionId,
      enrollments,
      sessions,
      fetchEnrollments,
      educationId: education.id,
    },
  };

  return (
    <>
      <TermInformationView {...props} />
    </>
  );
};

export default TermInformation;
