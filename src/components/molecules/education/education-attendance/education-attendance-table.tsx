import React, { ChangeEvent, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { CustomError } from '@/api/error/error';
import { EducationAttendanceApi } from '@/api/education/education-attendance.api';
import { setTargetEducationSession } from '@/redux/reducers/target/target-education-session-reducer';
import EducationAttendanceTableView from '@/components/molecules/education/education-attendance/education-attendance-table.view';
import { EDUCATION_ATTENDANCE_STATUS } from '@/constants/status/status';

export type EducationEnrollmentTableProps = {};

const EducationAttendanceTable = ({}: EducationEnrollmentTableProps) => {
  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );
  const dispatch = useDispatch<AppDispatch>();

  const educationAttendanceApi = new EducationAttendanceApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onChangeStatus = async (
    attendanceId: string,
    status: EDUCATION_ATTENDANCE_STATUS
  ) => {
    try {
      const newEducationSession = {
        ...targetEducationSession,
        educationAttendances: targetEducationSession.educationAttendances.map(
          (attendance) => {
            if (attendance.id === attendanceId) {
              return { ...attendance, status };
            } else {
              return attendance;
            }
          }
        ),
      };

      dispatch(setTargetEducationSession(newEducationSession));

      educationAttendanceApi.editEducationAttendance(
        {
          churchId,
          educationId: targetEducationTerm.educationId,
          educationTermId: targetEducationTerm.id,
          sessionId: targetEducationSession.id,
          attendanceId,
        },
        {
          status,
        }
      );
    } catch (error) {
      setThrownError(error as CustomError);
    }
  };

  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({}); // attendanceId별 타이머 관리

  const onChangeNote = (
    attendanceId: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newNote = event.target.value;

    const newEducationSession = {
      ...targetEducationSession,
      educationAttendances: targetEducationSession.educationAttendances.map(
        (attendance) => {
          if (attendance.id === attendanceId) {
            return { ...attendance, note: newNote };
          } else {
            return attendance;
          }
        }
      ),
    };

    dispatch(setTargetEducationSession(newEducationSession));

    // 기존 타이머 클리어
    if (debounceTimers.current[attendanceId]) {
      clearTimeout(debounceTimers.current[attendanceId]);
    }

    // 새로운 타이머 설정
    debounceTimers.current[attendanceId] = setTimeout(async () => {
      try {
        const response =
          await educationAttendanceApi.editEducationAttendanceNote(
            {
              churchId,
              educationId: targetEducationTerm.educationId,
              educationTermId: targetEducationTerm.id,
              sessionId: targetEducationSession.id,
              attendanceId,
            },
            {
              note: newNote,
            }
          );
      } catch (error) {
        setThrownError(error as CustomError);
      }
    }, 500); // 500ms 지연
  };
  const props = {
    onChangeStatus,
    onChangeNote,
  };

  return (
    <>
      <EducationAttendanceTableView {...props} />
    </>
  );
};

export default EducationAttendanceTable;
