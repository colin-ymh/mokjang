'use client';

import { HomeApi } from '@/api/home/home.api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect, useRef, useState } from 'react';
import { BLANK, RANGE } from '@/constants/constant';
import { DOMAIN } from '@/models/permission/permission';
import { Schedule, ServerReportedSchedule } from '@/models/calendar/calendar';
import { setTargetTask } from '@/redux/reducers/target/target-task-reducer';
import { setTargetVisitation } from '@/redux/reducers/target/target-visitation-reducer';
import { CalendarApi } from '@/api/calendar/calendar.api';
import { EducationsApi } from '@/api/education/educations.api';
import { EducationTermsApi } from '@/api/education/education-terms.api';
import { EducationSessionsApi } from '@/api/education/education-sessions.api';
import { EducationAttendanceApi } from '@/api/education/education-attendance.api';
import { setTargetEducation } from '@/redux/reducers/target/target-education-reducer';
import { setTargetEducationTerm } from '@/redux/reducers/target/target-education-term-reducer';
import { setTargetEducationSession } from '@/redux/reducers/target/target-education-session-reducer';
import ReportedScheduleWidgetView from '@/components/molecules/home/widget/reported-schedule-widget.view';
import { TasksApi } from '@/api/tasks/tasks.api';
import { VisitationsApi } from '@/api/visitations/visitations.api';
import { getReportedWidgetSchedule } from '@/utils/calendar';
import { setIsToastShown, setToastBackgroundColor, setToastText, } from '@/redux/reducers/toast-popup-reducer';
import { DESTRUCTIVE } from '@/constants/styles/color';
import { TASK_STATUS } from '@/constants/status/status';
import { DEFAULT_EDUCATION, DEFAULT_EDUCATION_TERM, } from '@/models/education/education';
import { fetchChurchScheduleSummary, fetchMyScheduleSummary, } from '@/redux/reducers/schedule-summary-reducer';

const ReportedScheduleWidget = () => {
  const scrollRef = useRef(null);

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

  const [reportedSchedules, setReportedSchedules] = useState<Schedule[]>([]);

  const [range, setRange] = useState<RANGE>(RANGE.WEEKLY);
  // 상세보기 중인 도메인
  const [openedDomain, setOpenedDomain] = useState<DOMAIN | null>(null);

  // 페이징
  const [page, setPage] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);

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

  const fetchMySchedules = async (pageParam?: number) => {
    const currentPage = pageParam ?? page;
    try {
      setIsFetching(true);
      const response = await homeApi.getReportedSchedules({
        churchId,
        range,
        page: currentPage,
      });

      const newSchedules = response.data.data;

      const newReportedSchedules = newSchedules.map(
        (schedule: ServerReportedSchedule) => {
          return getReportedWidgetSchedule(schedule);
        }
      );

      if (currentPage === 1) {
        // 첫 페이지는 교체
        setReportedSchedules(newReportedSchedules);
      } else {
        // 다음 페이지는 기존 목록 뒤에 추가
        setReportedSchedules((prev) => [...prev, ...newReportedSchedules]);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsFetching(false);
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
    // range가 바뀌면 페이지 초기화 후 새로 로드
    setPage(1);
    fetchMySchedules(1);
  }, [range]);

  useEffect(() => {
    if (page > 1) {
      fetchMySchedules(page);
    }
  }, [page]);

  useEffect(() => {
    const el =
      scrollRef &&
      (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current;
    if (!el) return;

    const handleScroll = () => {
      if (isFetching) return;
      const threshold = 24; // 하단 근처 여유 픽셀
      const reachedBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
      if (reachedBottom) {
        setPage((prev) => prev + 1);
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => {
      el.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRef, isFetching]);

  // ===== status =====
  const onChangeTaskStatus = (status: TASK_STATUS) => {
    try {
      tasksApi.editTask({ churchId, taskId: targetTask.id }, { status });
      dispatch(setTargetTask({ ...targetTask, status }));

      const newSchedules = reportedSchedules.map((schedule) => {
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
      setReportedSchedules(newSchedules);
      dispatch(fetchChurchScheduleSummary());
      dispatch(fetchMyScheduleSummary());
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

      const newSchedules = reportedSchedules.map((schedule) => {
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
      setReportedSchedules(newSchedules);
      dispatch(fetchChurchScheduleSummary());
      dispatch(fetchMyScheduleSummary());
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

      const newSchedules = reportedSchedules.map((schedule) => {
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
      setReportedSchedules(newSchedules);
      dispatch(fetchChurchScheduleSummary());
      dispatch(fetchMyScheduleSummary());
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

      const newSchedules = reportedSchedules.map((schedule) => {
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

      setReportedSchedules(newSchedules);
      dispatch(fetchChurchScheduleSummary());
      dispatch(fetchMyScheduleSummary());
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  // ===== status =====
  const props = {
    openedDomain,
    range,
    reportedSchedules,
    onClickSchedule,
    onClickClose,
    onClickRange,
    onChangeTaskStatus,
    onChangeVisitationStatus,
    onChangeEducationSessionStatus,
    onChangeEducationTermStatus,
    scrollRef,
  };
  return (
    <>
      <ReportedScheduleWidgetView {...props} />
    </>
  );
};

export default ReportedScheduleWidget;
