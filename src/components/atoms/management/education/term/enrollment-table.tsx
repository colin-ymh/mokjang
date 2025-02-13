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
import { useScopedI18n } from '../../../../../../locales/client';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';

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
  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');

  const dispatch = useDispatch<AppDispatch>();
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);
  const educationAttendanceApi = new EducationAttendanceApi(false);
  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);
  const [attendance, setAttendance] = useState<SessionAttendance[]>([]);
  const [checkedMemberIds, setCheckedMemberIds] = useState<string[]>([]);
  const [isDetailModalShown, setIsDetailModalShown] = useState<boolean>(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<EducationEnrollment>(DEFAULT_EDUCATION_ENROLLMENT);

  const onClickCheckAll = () => {
    if (checkedMemberIds.length === enrollments.length) {
      setCheckedMemberIds([]);
    } else {
      setCheckedMemberIds(enrollments.map((enrollment) => enrollment.memberId));
    }
  };

  const onClickCheckMember = (memberId: string) => {
    setCheckedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const onClickEnrollment = (enrollment: EducationEnrollment) => {
    setIsDetailModalShown(true);
    setSelectedEnrollment(enrollment);
  };

  const onClickClose = () => {
    setIsDetailModalShown(false);
  };

  const onClickHeader = (id: EDUCATION_ENROLLMENT) => {};

  const onScroll = () => {};

  const onChangeStatus = async (
    termId: string,
    enrollmentId: string,
    status: EDUCATION_STATUS
  ) => {
    try {
      await educationEnrollmentsApi.editEducationEnrollments(
        {
          churchId,
          educationId,
          educationTermId: termId,
          educationEnrollmentId: enrollmentId,
        },
        { status }
      );
      fetchEnrollments();
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onChangeAttendance = async (
    termId: string,
    attendanceId: string,
    isPresent: boolean
  ) => {
    try {
      await educationAttendanceApi.editEducationAttendance(
        {
          churchId,
          educationId,
          sessionId,
          educationTermId: termId,
          attendanceId,
        },
        { isPresent }
      );
      fetchAttendance();
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await educationAttendanceApi.getEducationAttendances({
        churchId,
        educationTermId: enrollments[0]?.educationTermId,
        sessionId,
        educationId,
      });
      setAttendance(response.data.data);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onClickDeleteMembers = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmDelete = async () => {
    try {
      const deletePromises = checkedMemberIds.map((enrollmentId) =>
        educationEnrollmentsApi.deleteEducationEnrollments({
          churchId,
          educationId,
          educationTermId: term.id,
          educationEnrollmentId: enrollmentId,
        })
      );

      await Promise.all(deletePromises);
      setCheckedMemberIds([]);

      const result = await dispatch(fetchMembers({ churchId, currentPage: 1 }));
      if (fetchMembers.fulfilled.match(result)) {
        fetchEnrollments();
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsPopupShown(false);
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

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
      <ConfirmPopup
        title={t_popup('deleteEnrollmentTitle')}
        body={t_popup('deleteEnrollmentBody')}
        isShow={isPopupShown}
        onClickLeftButton={() => setIsPopupShown(false)}
        onClickRightButton={onClickConfirmDelete}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('confirm')}
        buttonNum={2}
      />
    </>
  );
};

export default EnrollmentTable;
