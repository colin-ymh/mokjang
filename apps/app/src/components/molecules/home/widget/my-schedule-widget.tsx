'use client';

import { HomeApi } from '../../../../api/home/home.api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { useEffect, useState } from 'react';
import { BLANK, RANGE } from '@mokjang/constants';
import { DOMAIN } from '@mokjang/models';
import { Schedule, ServerSchedule } from '@mokjang/models';
import { setTargetTask } from '../../../../redux/reducers/target/target-task-reducer';
import { setTargetVisitation } from '../../../../redux/reducers/target/target-visitation-reducer';
import { CalendarApi } from '../../../../api/calendar/calendar.api';
import { EducationsApi } from '../../../../api/education/educations.api';
import { EducationTermsApi } from '../../../../api/education/education-terms.api';
import { EducationSessionsApi } from '../../../../api/education/education-sessions.api';
import { EducationAttendanceApi } from '../../../../api/education/education-attendance.api';
import { setTargetEducationSession } from '../../../../redux/reducers/target/target-education-session-reducer';
import MyScheduleWidgetView from './my-schedule-widget.view';
import { TasksApi } from '../../../../api/tasks/tasks.api';
import { VisitationsApi } from '../../../../api/visitations/visitations.api';
import { getMyWidgetSchedule } from '../../../../utils/calendar';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../../redux/reducers/toast-popup-reducer';
import { DESTRUCTIVE } from '@mokjang/constants';
import { TASK_STATUS } from '@mokjang/constants';
import { setTargetEducation } from '../../../../redux/reducers/target/target-education-reducer';
import { DEFAULT_EDUCATION, DEFAULT_EDUCATION_TERM } from '@mokjang/models';
import { setTargetEducationTerm } from '../../../../redux/reducers/target/target-education-term-reducer';
import {
  fetchChurchScheduleSummary,
  fetchMyScheduleSummary,
} from '../../../../redux/reducers/schedule-summary-reducer';

const MyScheduleWidget = () => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const { targetTask } = useSelector((state: RootState) => state.targetTask);
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );

  const [mySchedules, setMySchedules] = useState<Schedule[]>([]);

  const [range, setRange] = useState<RANGE>(RANGE.WEEKLY);
  // 상세보기 중인 도메인
  const [openedDomain, setOpenedDomain] = useState<DOMAIN | null>(null);

  const [thrownError, setThrownError] = useState<Error | null>(null);

  if (thrownError) throw thrownError;

  const homeApi = new HomeApi(false);
  const tasksApi = new TasksApi(false);
  const visitationsApi = new VisitationsApi(false);
  const calendarApi = new CalendarApi(false);
  const educationsApi = new EducationsApi(false);
  const educationTermsApi = new EducationTermsApi(false);
  const educationSessionsApi = new EducationSessionsApi(false);
  const educationAttendanceApi = new EducationAttendanceApi(false);

  const fetchMySchedules = async () => {
    try {
      const response = await homeApi.getMySchedules({ churchId, range });

      const newSchedules = response.data.data;
      const newMySchedules = newSchedules.map((schedule: ServerSchedule) => {
        return getMyWidgetSchedule(schedule);
      });

      setMySchedules(newMySchedules);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 이벤트 선택
  const onClickSchedule = async (event: Schedule) => {
    setOpenedDomain(null);
    try {
      if (event.id) {
        const [domain, id] = event.id.split('-');

        switch (domain) {
          case DOMAIN.TASK:
            const taskResponse = await tasksApi.getTask({
              churchId,
              taskId: id,
            });
            const newTask = taskResponse.data.data;
            dispatch(setTargetTask(newTask));
            setOpenedDomain(DOMAIN.TASK);
            return;
          case DOMAIN.VISITATION:
            const visitationResponse = await visitationsApi.getVisitation({
              churchId,
              visitationId: id,
            });
            const newVisitation = visitationResponse.data.data;
            dispatch(setTargetVisitation(newVisitation));
            setOpenedDomain(DOMAIN.VISITATION);
            return;
          case DOMAIN.EDUCATION_SESSION:
            const tempResponse = await calendarApi.getEducationDetail({
              churchId,
              educationSessionId: id,
            });
            const tempSession = tempResponse.data;

            const attendanceResponse =
              await educationAttendanceApi.getEducationAttendances({
                churchId,
                educationId: event.educationId as string,
                educationTermId: event.educationTermId as string,
                sessionId: tempSession.id,
              });
            const newEducationAttendances = attendanceResponse.data.data;

            const sessionResponse =
              await educationSessionsApi.getEducationSession({
                churchId,
                educationId: event.educationId as string,
                educationTermId: event.educationTermId as string,
                educationSessionId: tempSession.id,
              });

            const newEducationSession = sessionResponse.data.data;

            dispatch(
              setTargetEducation({
                ...DEFAULT_EDUCATION,
                name: event.educationName || BLANK,
                id: event.educationId || BLANK,
              })
            );

            dispatch(
              setTargetEducationTerm({
                ...DEFAULT_EDUCATION_TERM,
                id: event.educationTermId || BLANK,
                educationId: event.educationId || BLANK,
                educationName: event.educationName || BLANK,
                term: event.educationTerm || BLANK,
              })
            );
            dispatch(
              setTargetEducationSession({
                ...newEducationSession,
                educationAttendances: newEducationAttendances,
              })
            );
            setOpenedDomain(DOMAIN.EDUCATION_SESSION);
            return;
          case DOMAIN.EDUCATION_TERM:
            const termResponse = await educationTermsApi.getEducationTerm({
              churchId,
              educationId: event.educationId as string,
              educationTermId: event.educationTermId as string,
            });

            const newEducationTerm = termResponse.data.data;

            dispatch(
              setTargetEducation({
                ...DEFAULT_EDUCATION,
                name: event.educationName || BLANK,
                id: event.educationId || BLANK,
              })
            );

            dispatch(setTargetEducationTerm(newEducationTerm));
            setOpenedDomain(DOMAIN.EDUCATION_TERM);
            return;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else setThrownError(new Error(String(error)));
    }
  };

  const onClickClose = () => {
    setOpenedDomain(null);
  };

  const onClickRange = (value: RANGE) => {
    setRange(value);
  };

  useEffect(() => {
    fetchMySchedules();
  }, [range]);

  // ===== status =====
  const onChangeTaskStatus = (status: TASK_STATUS) => {
    try {
      tasksApi.editTask({ churchId, taskId: targetTask.id }, { status });
      dispatch(setTargetTask({ ...targetTask, status }));

      const newSchedules = mySchedules.map((schedule) => {
        if (schedule.id) {
          const [domain, id] = schedule.id.split('-');
          if (domain === DOMAIN.TASK && id == targetTask.id) {
            return { ...schedule, status };
          } else {
            return schedule;
          }
        } else {
          return schedule;
        }
      });
      setMySchedules(newSchedules);
      dispatch(fetchMyScheduleSummary());
      dispatch(fetchChurchScheduleSummary());
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onChangeVisitationStatus = (status: TASK_STATUS) => {
    try {
      visitationsApi.editVisitation(
        { churchId, visitationId: targetVisitation.id },
        { status }
      );
      dispatch(setTargetVisitation({ ...targetVisitation, status }));

      const newSchedules = mySchedules.map((schedule) => {
        if (schedule.id) {
          const [domain, id] = schedule.id.split('-');
          if (domain === DOMAIN.VISITATION && id == targetVisitation.id) {
            return { ...schedule, status };
          } else {
            return schedule;
          }
        } else {
          return schedule;
        }
      });
      setMySchedules(newSchedules);
      dispatch(fetchMyScheduleSummary());
      dispatch(fetchChurchScheduleSummary());
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onChangeEducationSessionStatus = (status: TASK_STATUS) => {
    try {
      educationSessionsApi.editEducationSession(
        {
          churchId,
          educationId: targetEducationTerm.educationId,
          educationTermId: targetEducationTerm.id,
          educationSessionId: targetEducationSession.id,
        },
        { status }
      );
      dispatch(
        setTargetEducationSession({ ...targetEducationSession, status })
      );

      const newSchedules = mySchedules.map((schedule) => {
        if (schedule.id) {
          const [domain, id] = schedule.id.split('-');
          if (
            domain === DOMAIN.EDUCATION_SESSION &&
            id == targetEducationSession.id
          ) {
            return { ...schedule, status };
          } else {
            return schedule;
          }
        } else {
          return schedule;
        }
      });
      setMySchedules(newSchedules);
      dispatch(fetchMyScheduleSummary());
      dispatch(fetchChurchScheduleSummary());
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  // ===== status =====

  // ===== status =====

  const onChangeEducationTermStatus = async (status: TASK_STATUS) => {
    try {
      const response = await educationTermsApi.editEducationTerm(
        {
          churchId,
          educationId: targetEducationTerm.educationId,
          educationTermId: targetEducationTerm.id,
        },
        { status }
      );

      const newEducationTerm = response.data.data;

      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          status,
        })
      );

      const newSchedules = mySchedules.map((schedule) => {
        if (schedule.id) {
          const [domain, id] = schedule.id.split('-');
          if (
            domain === DOMAIN.EDUCATION_TERM &&
            id == targetEducationTerm.id
          ) {
            return { ...schedule, status };
          } else {
            return schedule;
          }
        } else {
          return schedule;
        }
      });

      setMySchedules(newSchedules);
      dispatch(fetchMyScheduleSummary());
      dispatch(fetchChurchScheduleSummary());
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  // ===== status =====

  const props = {
    openedDomain,
    range,
    mySchedules,
    onClickSchedule,
    onClickClose,
    onClickRange,
    onChangeTaskStatus,
    onChangeVisitationStatus,
    onChangeEducationSessionStatus,
    onChangeEducationTermStatus,
  };
  return (
    <>
      <MyScheduleWidgetView {...props} />
    </>
  );
};

export default MyScheduleWidget;
