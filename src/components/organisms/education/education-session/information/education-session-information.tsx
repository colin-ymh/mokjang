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

import { STATUS, TASK_STATUS } from '@/constants/status/status';
import { EducationAttendanceApi } from '@/api/education/education-attendance.api';
import { setEducations } from '@/redux/reducers/filter/education-filter-reducer';
import { EDUCATION_SESSION_CONTENT_ID } from '@/constants/layout/content';
import { CustomError } from '@/api/error/error';

type EducationSessionInformationProps = {};

const EducationSessionInformation = ({}: EducationSessionInformationProps) => {
  const { educations } = useSelector(
    (state: RootState) => state.educationFilter
  );
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
  const educationAttendanceApi = new EducationAttendanceApi(false);

  const [headerBar, setHeaderBar] = useState<EDUCATION_SESSION_CONTENT_ID>(
    EDUCATION_SESSION_CONTENT_ID.CONTENT
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onChangeHeaderBar = (headerBar: EDUCATION_SESSION_CONTENT_ID) => {
    setHeaderBar(headerBar);
  };

  // ===== status =====

  const onChangeStatus = (status: TASK_STATUS) => {
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

          const newEducationTerms = targetEducation.educationTerms.map(
            (term) =>
              term.id === newTargetEducationTerm.id
                ? newTargetEducationTerm
                : term
          );

          const newEducations = educations.map((education) => {
            if (education.id === targetEducation.id) {
              return {
                ...education,
                educationTerms: newEducationTerms,
              };
            } else {
              return education;
            }
          });
          dispatch(setEducations(newEducations));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  // ===== status =====

  const onClickAllAttended = () => {
    try {
      const newEducationSession = {
        ...targetEducationSession,
        educationAttendances: targetEducationSession.educationAttendances.map(
          (attendance) => {
            return {
              ...attendance,
              status: STATUS.PRESENT,
            } as EducationAttendance;
          }
        ),
      };

      dispatch(setTargetEducationSession(newEducationSession));

      educationAttendanceApi.patchAllAttended({
        churchId,
        educationId: targetEducationTerm.educationId,
        educationTermId: targetEducationTerm.id,
        sessionId: targetEducationSession.id,
      });
    } catch (error) {
      setThrownError(error as CustomError);
    }
  };

  const props = {
    headerBar,
    onChangeHeaderBar,
    onChangeStatus,
    onClickAllAttended,
  };
  return (
    <>
      <EducationSessionInformationView {...props} />
    </>
  );
};

export default EducationSessionInformation;
