import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { EducationSessionsApi } from '@/api/education/education-sessions.api';
import { useState } from 'react';
import {
  EducationAttendance,
  EducationSession,
} from '@/models/education/education';
import { setTargetEducationSession } from '@/redux/reducers/target/target-education-session-reducer';
import EducationSessionInformationView from '@/components/organisms/education/education-session/information/education-session-information.view';
import { setTargetEducationTerm } from '@/redux/reducers/target/target-education-term-reducer';

import { EDUCATION_SESSION_STATUS } from '@/constants/status/status';
import { setEducationTerms } from '@/redux/reducers/filter/education-term-filter-reducer';
import { EducationAttendanceApi } from '@/api/education/education-attendance.api';

type EducationSessionInformationProps = {};

const EducationSessionInformation = ({}: EducationSessionInformationProps) => {
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const { educationTerms } = useSelector(
    (state: RootState) => state.educationTermFilter
  );
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );
  const { churchId } = useSelector((state: RootState) => state.church);

  const dispatch = useDispatch<AppDispatch>();
  const educationSessionsApi = new EducationSessionsApi(false);
  const educationAttendanceApi = new EducationAttendanceApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // ===== status =====

  const onChangeStatus = (status: EDUCATION_SESSION_STATUS) => {
    try {
      educationSessionsApi
        .editEducationSession(
          {
            churchId,
            educationId: targetEducation.id,
            educationTermId: targetEducationTerm.id,
            educationSessionId: targetEducationSession.id,
          },
          { status: status }
        )
        .then((response) => {
          const newEducationSession: EducationSession = response.data.data;

          dispatch(
            setTargetEducationSession({
              ...targetEducationSession,
              status: status,
            })
          );

          const newEducationSessions: EducationSession[] =
            targetEducationTerm.educationSessions.map((session) => {
              if (session.id === newEducationSession.id) {
                return newEducationSession;
              } else {
                return session;
              }
            });

          const newTargetEducationTerm = {
            ...targetEducationTerm,
            educationSessions: newEducationSessions,
          };
          dispatch(setTargetEducationTerm(newTargetEducationTerm));

          const newEducationTerms = educationTerms.map((term) =>
            term.id === newTargetEducationTerm.id
              ? newTargetEducationTerm
              : term
          );
          dispatch(setEducationTerms(newEducationTerms));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  // ===== status =====

  // 출석 상태 변경
  const onChangeAttendanceStatus = (
    value: boolean,
    attendance: EducationAttendance
  ) => {
    try {
      educationAttendanceApi
        .editEducationAttendance(
          {
            churchId,
            educationId: targetEducation.id,
            educationTermId: targetEducationTerm.id,
            sessionId: targetEducationSession.id,
            attendanceId: attendance.id,
          },
          { isPresent: value }
        )
        .then((response) => {
          const newEducationAttendance = response.data;

          const newEducationAttendances =
            targetEducationSession.educationAttendances.map((attendance) => {
              if (attendance.id === newEducationAttendance.id) {
                return newEducationAttendance;
              } else {
                return attendance;
              }
            });

          const newEducationSession = {
            ...targetEducationSession,
            educationEnrollments: newEducationAttendances,
          };

          dispatch(setTargetEducationSession(newEducationSession));

          // const newEducationSessions = educationSessions.map((v) => {
          //   return v.id !== targetEducationSession.id ? v : newEducationSession;
          // });
          //
          // dispatch(setEducationSessions(newEducationSessions));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const props = {
    onChangeStatus,
    onChangeAttendanceStatus,
  };
  return (
    <>
      <EducationSessionInformationView {...props} />
    </>
  );
};

export default EducationSessionInformation;
