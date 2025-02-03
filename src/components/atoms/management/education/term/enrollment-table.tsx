import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import {
  DEFAULT_EDUCATION_ENROLLMENT,
  EducationEnrollment,
  EducationTerm,
  SessionAttendance,
} from '@/models/management/management';
import EnrollmentTableView from '@/components/atoms/management/education/term/enrollment-table.view';
import { EDUCATION_ENROLLMENT } from '@/constants/management/education-term-column';
import { EducationAttendanceApi } from '@/api/management/education/education-attendance.api';
import { EDUCATION_TERM_HEADER_ID } from '@/constants/layout/header';
import { EDUCATION_STATUS } from '@/constants/constant';
import { EducationEnrollmentsApi } from '@/api/management/education/education-enrollments.api';
import { fetchMembers } from '@/redux/reducers/member-filter-reducer';

export type EnrollmentTableProps = {
  term: EducationTerm;
  enrollments: EducationEnrollment[];
  sessionId: string;
  educationId: string;
  isInformation: boolean;
  fetchEnrollments: () => void;
};

const EnrollmentTable = ({
  term,
  enrollments,
  sessionId,
  educationId,
  isInformation,
  fetchEnrollments,
}: EnrollmentTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);
  const educationAttendanceApi = new EducationAttendanceApi(false);

  // 출석부
  const [attendance, setAttendance] = useState<SessionAttendance[]>([]);

  // 선택된 교인 id 배열
  const [checkedMemberIds, setCheckedMemberIds] = useState<string[]>([]);

  // 전체 선택 버튼 이벤트
  const onClickCheckAll = () => {
    // 전체 선택된 경우
    if (checkedMemberIds.length === enrollments.length) {
      setCheckedMemberIds([]);
    }
    // 미선택된 등록이 있는 경우
    else {
      const newMemberIds = enrollments.map((enrollment) => {
        return enrollment.memberId;
      });
      setCheckedMemberIds(newMemberIds);
    }
  };

  // 특정 교인 선택 이벤트
  const onClickCheckMember = (memberId: string) => {
    // 이미 선택된 경우 => 제외
    if (checkedMemberIds.includes(memberId)) {
      const newCheckedMemberIds = checkedMemberIds.filter(
        (id) => id !== memberId
      );
      setCheckedMemberIds(newCheckedMemberIds);
    }
    // 선택되지 않은 경우 => 추가
    else {
      setCheckedMemberIds([...checkedMemberIds, memberId]);
    }
  };

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

  // 수려 상태 변경
  const onChangeStatus = (
    termId: string,
    enrollmentId: string,
    status: EDUCATION_STATUS
  ) => {
    educationEnrollmentsApi
      .editEducationEnrollments(
        {
          churchId,
          educationId,
          educationTermId: termId,
          educationEnrollmentId: enrollmentId,
        },
        {
          status,
        }
      )
      .then(() => {});
  };

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
        setAttendance(response.data.data);
      });
  };

  // 선택된 등록 교인들 삭제하기
  const onClickDeleteMembers = async () => {
    try {
      // 1) 모든 삭제 요청(비동기)을 배열로 만든 후,
      const deletePromises = checkedMemberIds.map((enrollmentId: string) => {
        return educationEnrollmentsApi.deleteEducationEnrollments({
          churchId,
          educationId,
          educationTermId: term.id,
          educationEnrollmentId: enrollmentId,
        });
      });

      // 2) Promise.all로 전부 완료될 때까지 대기
      await Promise.all(deletePromises);

      setCheckedMemberIds([]);

      // 3) 모든 삭제가 끝난 후 등록 초기화
      await dispatch(fetchMembers({ churchId, currentPage: 1 })).then(
        (result) => {
          if (fetchMembers.fulfilled.match(result)) {
            fetchEnrollments();
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (enrollments[0] && sessionId !== EDUCATION_TERM_HEADER_ID.INFORMATION) {
      fetchAttendance();
    }
  }, [churchId, educationId, sessionId, enrollments]);

  useEffect(() => {
    setCheckedMemberIds([]);
  }, [sessionId]);

  const props = {
    enrollments,
    attendance,
    scrollRef,
    isInformation,
    checkedMemberIds,
    onClickEnrollment,
    onClickHeader,
    onScroll,
    onChangeStatus,
    onChangeAttendance,
    onClickCheckAll,
    onClickCheckMember,
    onClickDeleteMembers,
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
