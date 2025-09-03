import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import {
  fetchCalendarSchedules,
  setCalendarSchedules,
} from '../../../redux/reducers/filter/calendar-filter-reducer';
import { getDateStringFromDate } from '../../../utils/date';
import MainCalendarView from './main-calendar.view';
import { Schedule } from '../../../models/calendar/calendar';
import { DOMAIN } from '../../../models/permission/permission';
import { setTargetTask } from '../../../redux/reducers/target/target-task-reducer';
import { setTargetVisitation } from '../../../redux/reducers/target/target-visitation-reducer';
import { setTargetEducationSession } from '../../../redux/reducers/target/target-education-session-reducer';
import { CalendarApi } from '../../../api/calendar/calendar.api';
import { setTargetEducationTerm } from '../../../redux/reducers/target/target-education-term-reducer';
import { EducationAttendanceApi } from '../../../api/education/education-attendance.api';
import { setTargetEducation } from '../../../redux/reducers/target/target-education-reducer';
import { EducationSessionsApi } from '../../../api/education/education-sessions.api';
import { TASK_STATUS } from '../../../constants/status/status';
import { TasksApi } from '../../../api/tasks/tasks.api';
import { VisitationsApi } from '../../../api/visitations/visitations.api';
import {
  DEFAULT_EDUCATION,
  DEFAULT_EDUCATION_TERM,
} from '../../../models/education/education';
import { BLANK } from '../../../constants/constant';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../redux/reducers/toast-popup-reducer';
import { DESTRUCTIVE } from '../../../constants/styles/color';
import { setTargetChurchEvent } from '../../../redux/reducers/target/target-church-event-reducer';
import { ChurchEvent } from '../../../models/church-event/church-event';
import { setTargetMember } from '../../../redux/reducers/target/target-member-reducer';
import { MembersApi } from '../../../api/members/members.api';

const MainCalendar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);
  const { calendarSchedules } = useSelector(
    (state: RootState) => state.calendarFilter
  );

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

  const membersApi = new MembersApi(false);
  const tasksApi = new TasksApi(false);
  const visitationsApi = new VisitationsApi(false);
  const calendarApi = new CalendarApi(false);
  const educationSessionsApi = new EducationSessionsApi(false);
  const educationAttendanceApi = new EducationAttendanceApi(false);

  // 보고있는 날짜
  const [date, setDate] = useState<Date>(new Date());

  // 상세보기 중인 도메인
  const [openedDomain, setOpenedDomain] = useState<DOMAIN | null>(null);

  const [thrownError, setThrownError] = useState<Error | null>(null);

  if (thrownError) throw thrownError;

  // 날짜 변경 시 반영
  const onChangeDate = (date: Date) => {
    setDate(date);
  };

  // 이벤트 선택
  const onSelectSchedule = async (event: Schedule) => {
    setOpenedDomain(null);
    try {
      if (event.id) {
        const [domain, id] = event.id.split('-');

        switch (domain) {
          case DOMAIN.MEMBER:
            if (event.member) {
              const response = await membersApi.getMember({
                churchId,
                memberId: event.member.id,
              });

              const newMember = response.data.data;
              dispatch(setTargetMember(newMember));
              setOpenedDomain(DOMAIN.MEMBER);
            }
            return;
          case DOMAIN.CHURCH_EVENT:
            dispatch(setTargetChurchEvent(event.churchEvent as ChurchEvent));
            setOpenedDomain(DOMAIN.CHURCH_EVENT);
            return;
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
                educationId: tempSession.educationTerm.education.id as string,
                educationTermId: tempSession.educationTerm.id as string,
                sessionId: tempSession.id,
              });
            const newEducationAttendances = attendanceResponse.data.data;

            const sessionResponse =
              await educationSessionsApi.getEducationSession({
                churchId,
                educationId: tempSession.educationTerm.education.id as string,
                educationTermId: tempSession.educationTerm.id as string,
                educationSessionId: tempSession.id,
              });

            const newEducationSession = sessionResponse.data.data;

            dispatch(
              setTargetEducation({
                ...DEFAULT_EDUCATION,
                name: tempSession.educationTerm.education.name || BLANK,
                id: tempSession.educationTerm.education.id || BLANK,
              })
            );

            dispatch(
              setTargetEducationTerm({
                ...DEFAULT_EDUCATION_TERM,
                id: tempSession.educationTerm.id || BLANK,
                educationId: tempSession.educationTerm.education.id || BLANK,
                educationName:
                  tempSession.educationTerm.education.name || BLANK,
                term: tempSession.educationTerm.id || BLANK,
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

  // 날짜, 필터 내용 변경 시, 일정 리로드
  useEffect(() => {
    const newFromDate = new Date(date);
    const newToDate = new Date(date);
    newFromDate.setMonth(newFromDate.getMonth() - 2);
    newToDate.setMonth(newToDate.getMonth() + 3);

    dispatch(
      fetchCalendarSchedules({
        fromDate: getDateStringFromDate(newFromDate),
        toDate: getDateStringFromDate(newToDate),
      })
    );
  }, [date]);

  // ===== status =====
  const onChangeTaskStatus = (status: TASK_STATUS) => {
    try {
      tasksApi.editTask({ churchId, taskId: targetTask.id }, { status });
      dispatch(setTargetTask({ ...targetTask, status }));

      const newSchedules = calendarSchedules.map((schedule) => {
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
      dispatch(setCalendarSchedules(newSchedules));
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

      const newSchedules = calendarSchedules.map((schedule) => {
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
      dispatch(setCalendarSchedules(newSchedules));
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

      const newSchedules = calendarSchedules.map((schedule) => {
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
      dispatch(setCalendarSchedules(newSchedules));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  // ===== status =====

  const props = {
    date,
    openedDomain,
    onClickClose,
    onChangeDate,
    onSelectSchedule,
    onChangeTaskStatus,
    onChangeVisitationStatus,
    onChangeEducationSessionStatus,
  };

  return (
    <>
      <MainCalendarView {...props} />
    </>
  );
};

export default MainCalendar;
