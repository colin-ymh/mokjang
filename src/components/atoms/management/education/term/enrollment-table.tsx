import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import {
  DEFAULT_EDUCATION_ENROLLMENT,
  EducationEnrollment,
  SessionAttendance,
} from '@/models/management/management';
import EnrollmentTableView from '@/components/atoms/management/education/term/enrollment-table.view';
import { EDUCATION_ENROLLMENT } from '@/constants/management/education-term-column';
import { EducationAttendanceApi } from '@/api/management/education/education-attendance.api';
import { EDUCATION_TERM_HEADER_ID } from '@/constants/layout/header';

export type EnrollmentTableProps = {
  enrollments: EducationEnrollment[];
  sessionId: string;
  educationId: string;
  isInformation: boolean;
};

const EnrollmentTable = ({
  enrollments,
  sessionId,
  educationId,
  isInformation,
}: EnrollmentTableProps) => {
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const educationAttendanceApi = new EducationAttendanceApi(false);

  // 출석부
  const [attendance, setAttendance] = useState<SessionAttendance[]>([]);

  // 상세 모달 활성화 여부
  const [isDetailModalShown, setIsDetailModalShown] = useState<boolean>(false);

  // 선택된 인원
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<EducationEnrollment>(DEFAULT_EDUCATION_ENROLLMENT);

  // 기수 클릭 시 이벤트
  const onClickEnrollment = (enrollment: EducationEnrollment) => {
    setIsDetailModalShown(true);
    setSelectedEnrollment(enrollment);
  };

  // 모달 닫기
  const onClickClose = () => {
    setIsDetailModalShown(false);
  };

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: EDUCATION_ENROLLMENT) => {};

  // 스크롤 시 이벤트
  const onScroll = () => {};

  // 출석 상태 변경
  const onChangeAttendance = (
    termId: string,
    attendanceId: string,
    isPresent: boolean
  ) => {
    educationAttendanceApi
      .editEducationAttendance(
        {
          churchId,
          educationId,
          sessionId,
          educationTermId: termId,
          attendanceId: attendanceId,
        },
        {
          isPresent,
        }
      )
      .then(() => {
        fetchAttendance();
      });
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  // 출석부 조회
  const fetchAttendance = () => {
    educationAttendanceApi
      .getEducationAttendances({
        churchId,
        educationTermId: enrollments[0].educationTermId,
        sessionId,
        educationId,
      })
      .then((response) => {
        setAttendance(response.data);
      });
  };

  useEffect(() => {
    if (enrollments[0] && sessionId !== EDUCATION_TERM_HEADER_ID.INFORMATION) {
      fetchAttendance();
    }
  }, [churchId, educationId, sessionId, enrollments]);

  const props = {
    enrollments,
    attendance,
    isInformation,
    onClickEnrollment,
    onClickHeader,
    scrollRef,
    onScroll,
    onChangeAttendance,
  };

  return (
    <>
      <EnrollmentTableView {...props} />
      {/*<CustomPopup*/}
      {/*  isShow={isDetailModalShown}*/}
      {/*  onClickClose={onClickClose}*/}
      {/*  width={70}*/}
      {/*  height={90}*/}
      {/*  isPercentage={true}*/}
      {/*>*/}
      {/*</CustomPopup>*/}
    </>
  );
};

export default EnrollmentTable;
