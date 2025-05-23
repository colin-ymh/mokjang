import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { EducationSessionsApi } from '@/api/education/education-sessions.api';
import { useState } from 'react';
import {
  EDUCATION_ENROLLMENT_STATUS,
  EDUCATION_SESSION_STATUS,
  EducationEnrollment,
  EducationSession,
} from '@/models/education/education';
import { setTargetEducationSession } from '@/redux/reducers/target-education-session-reducer';
import EducationSessionInformationView from '@/components/organisms/education/education-session/information/education-session-information.view';
import { EducationEnrollmentsApi } from '@/api/education/education-enrollments.api';
import { setTargetEducationTerm } from '@/redux/reducers/target-education-term-reducer';

type EducationSessionInformationProps = {};

const EducationSessionInformation = ({}: EducationSessionInformationProps) => {
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
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
  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);

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

          dispatch(
            setTargetEducationTerm({
              ...targetEducationTerm,
              educationSessions: newEducationSessions,
            })
          );
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  // ===== status =====

  // 수강 교인 상태 변경
  const onChangeEnrollmentStatus = (
    value: EDUCATION_ENROLLMENT_STATUS,
    enrollment: EducationEnrollment
  ) => {
    try {
      // educationEnrollmentsApi
      //   .editEducationEnrollment(
      //     {
      //       churchId,
      //       educationId: targetEducation.id,
      //       educationSessionId: targetEducationSession.id,
      //       educationEnrollmentId: enrollment.id,
      //     },
      //     { status: value }
      //   )
      //   .then((response) => {
      //     const newEducationEnrollment = response.data;
      //
      //     const newEducationEnrollments =
      //       targetEducationSession.educationEnrollments.map((enrollment) => {
      //         if (enrollment.id === newEducationEnrollment.id) {
      //           return newEducationEnrollment;
      //         } else {
      //           return enrollment;
      //         }
      //       });
      //
      //     const newEducationSession = {
      //       ...targetEducationSession,
      //       educationEnrollments: newEducationEnrollments,
      //     };
      //
      //     dispatch(setTargetEducationSession(newEducationSession));
      //
      //     const newEducationSessions = educationSessions.map((v) => {
      //       return v.id !== targetEducationSession.id ? v : newEducationSession;
      //     });
      //
      //     dispatch(setEducationSessions(newEducationSessions));
      //   });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const props = {
    onChangeStatus,
    onChangeEnrollmentStatus,
  };
  return (
    <>
      <EducationSessionInformationView {...props} />
    </>
  );
};

export default EducationSessionInformation;
