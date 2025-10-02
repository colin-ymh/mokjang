import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCalendarSchedules, setCalendarSchedules, } from '@/redux/reducers/filter/calendar-filter-reducer';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getFullStringFromDate,
  getIsWellFormedTitle,
} from '@mokjang/utils';
import MainCalendarView from './main-calendar.view';
import {
  ChurchEvent,
  DEFAULT_EDUCATION,
  DEFAULT_EDUCATION_TERM,
  DOMAIN,
  EducationSession,
  Schedule,
  Task,
  Visitation,
} from '@mokjang/models';
import { setTargetTask } from '@/redux/reducers/target/target-task-reducer';
import { setTargetVisitation } from '@/redux/reducers/target/target-visitation-reducer';
import { setTargetEducationSession } from '@/redux/reducers/target/target-education-session-reducer';
import { CalendarApi } from '@/api/calendar/calendar.api';
import { setTargetEducationTerm } from '@/redux/reducers/target/target-education-term-reducer';
import { EducationAttendanceApi } from '@/api/education/education-attendance.api';
import { setTargetEducation } from '@/redux/reducers/target/target-education-reducer';
import { EducationSessionsApi } from '@/api/education/education-sessions.api';
import { BLACK, BLANK, DESTRUCTIVE, TASK_STATUS } from '@mokjang/constants';
import { TasksApi } from '@/api/tasks/tasks.api';
import { VisitationsApi } from '@/api/visitations/visitations.api';
import { setIsToastShown, setToastBackgroundColor, setToastText, } from '@/redux/reducers/toast-popup-reducer';
import { setTargetChurchEvent } from '@/redux/reducers/target/target-church-event-reducer';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';
import { MembersApi } from '@/api/members/members.api';
import {
  getScheduleFromChurchEvent,
  getScheduleFromEducationSession,
  getScheduleFromTask,
  getScheduleFromVisitation,
} from '@/utils/calendar';
import { ChurchEventsApi } from '@/api/church-event/church-events.api';
import { useScopedI18n } from '../../../../locales/client';

const MainCalendar = () => {
  const t_popup = useScopedI18n('popup');
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
  const { targetChurchEvent } = useSelector(
    (state: RootState) => state.targetChurchEvent
  );

  const churchEventsApi = new ChurchEventsApi(false);
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

  const [isEventEditShown, setIsEventEditShown] = useState<boolean>(false);
  const [isEventSaveEnable, setIsEventSaveEnable] = useState<boolean>(false);

  const [isEventDeleteShown, setIsEventDeleteShown] = useState<boolean>(false);

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
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else setThrownError(new Error(String(error)));
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
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else setThrownError(new Error(String(error)));
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
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else setThrownError(new Error(String(error)));
    }
  };
  // ===== status =====

  const onClickEventEditOpen = () => {
    setIsEventEditShown(true);
  };
  const onClickEventEditClose = () => {
    setIsEventEditShown(false);
  };

  const onClickEventEditDone = async () => {
    try {
      const response = await churchEventsApi.editChurchEvent(
        { churchId, eventId: targetChurchEvent.id },
        {
          title: targetChurchEvent.title || undefined,
          description: targetChurchEvent.description || undefined,
          date: targetChurchEvent.date || undefined,
        }
      );

      const newEvent = response.data.data;
      const newSchedules = calendarSchedules.map((schedule) => {
        if (schedule.id) {
          const [domain, id] = schedule.id.split('-');
          if (domain === DOMAIN.CHURCH_EVENT && id == targetChurchEvent.id) {
            return getScheduleFromChurchEvent(newEvent);
          } else {
            return schedule;
          }
        } else {
          return schedule;
        }
      });
      dispatch(setCalendarSchedules(newSchedules));
      setIsEventEditShown(false);
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else setThrownError(new Error(String(error)));
    }
  };

  // 저장 가능 여부 확인
  useEffect(() => {
    if (!getIsWellFormedTitle(targetChurchEvent.title)) {
      setIsEventSaveEnable(false);
      return;
    }

    if (!targetChurchEvent.date) {
      setIsEventSaveEnable(false);
      return;
    }

    setIsEventSaveEnable(true);
  }, [targetChurchEvent]);

  const onClickEventDeleteOpen = () => {
    setIsEventDeleteShown(true);
  };
  const onClickEventDeleteClose = () => {
    setIsEventDeleteShown(false);
  };
  const onClickEventDelete = async () => {
    try {
      await churchEventsApi.deleteChurchEvent({
        churchId,
        eventId: targetChurchEvent.id,
      });

      const newSchedules = calendarSchedules.filter(
        (schedule) =>
          !(
            schedule.id &&
            schedule.id.startsWith(
              `${DOMAIN.CHURCH_EVENT}-${targetChurchEvent.id}`
            )
          )
      );

      dispatch(setCalendarSchedules(newSchedules));
      setIsEventDeleteShown(false);
      setOpenedDomain(null);
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else setThrownError(new Error(String(error)));
    }
  };

  //  수정
  const [isTaskEditShown, setIsTaskEditShown] = useState<boolean>(false);
  const [isTaskSaveEnabled, setIsTaskSaveEnabled] = useState<boolean>(false);

  const onClickTaskEditClose = () => {
    setIsTaskEditShown(false);
  };

  const onClickTaskEditOpen = () => {
    setIsTaskEditShown(true);
  };

  const onClickTaskEditDone = async () => {
    try {
      const prevResponse = await tasksApi.getTask({
        churchId,
        taskId: targetTask.id,
      });

      const prev: Task = prevResponse.data.data;

      await tasksApi
        .editTask(
          { churchId, taskId: targetTask.id },
          {
            status:
              targetTask.status !== prev.status ? targetTask.status : undefined,
            title:
              targetTask.title !== prev.title ? targetTask.title : undefined,
            inChargeId:
              targetTask.inChargeId !== prev.inChargeId
                ? targetTask.inChargeId
                : undefined,
            startDate:
              getFullStringFromDate(
                getDateFromDateString(targetTask.startDate)
              ) !== getFullStringFromDate(getDateFromDateString(prev.startDate))
                ? getFullStringFromDate(
                    getDateFromDateString(targetTask.startDate)
                  )
                : undefined,
            endDate:
              getFullStringFromDate(
                getDateFromDateString(targetTask.endDate)
              ) !== getFullStringFromDate(getDateFromDateString(prev.endDate))
                ? getFullStringFromDate(
                    getDateFromDateString(targetTask.endDate)
                  )
                : undefined,
            parentTaskId:
              targetTask.parentTaskId !== prev.parentTaskId
                ? targetTask.parentTaskId
                : undefined,
            content:
              targetTask.content !== prev.content
                ? targetTask.content
                : undefined,
          }
        )
        .then(async () => {
          const reports = prev?.reports;

          const receiverIds =
            reports?.map((report) => report.receiver.id) || [];

          const addReceiverIds = targetTask.receiverIds?.filter(
            (receiverId) => !receiverIds.includes(receiverId)
          );
          const deleteReceiverIds =
            receiverIds?.filter(
              (receiverId) => !targetTask.receiverIds?.includes(receiverId)
            ) || [];

          if (addReceiverIds?.length > 0) {
            await tasksApi.addReceivers(
              {
                churchId,
                taskId: targetTask.id,
              },
              { receiverIds: addReceiverIds }
            );
          }

          if (deleteReceiverIds?.length > 0) {
            await tasksApi.deleteReceivers(
              {
                churchId,
                taskId: targetTask.id,
              },
              { receiverIds: deleteReceiverIds }
            );
          }

          const response = await tasksApi.getTask({
            churchId,
            taskId: targetTask.id,
          });
          const newTask = response.data.data;

          dispatch(setTargetTask(newTask));

          const newSchedules = calendarSchedules.map((schedule) => {
            if (schedule.id) {
              const [domain, id] = schedule.id.split('-');
              if (domain === DOMAIN.TASK && id == targetTask.id) {
                return getScheduleFromTask(newTask);
              } else {
                return schedule;
              }
            } else {
              return schedule;
            }
          });
          dispatch(setCalendarSchedules(newSchedules));

          setIsTaskEditShown(false);
        });

      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setToastBackgroundColor(BLACK));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  useEffect(() => {
    if (!getIsWellFormedTitle(targetTask.title)) {
      setIsTaskSaveEnabled(false);
      return;
    }
    if (targetTask.inChargeId === BLANK) {
      setIsTaskSaveEnabled(false);
      return;
    }
    if (!targetTask.startDate || !targetTask.endDate) {
      setIsTaskSaveEnabled(false);
      return;
    }

    setIsTaskSaveEnabled(true);
  }, [targetTask]);

  const [isVisitationEditShown, setIsVisitationEditShown] =
    useState<boolean>(false);
  const [isVisitationSaveEnabled, setIsVisitationSaveEnabled] =
    useState<boolean>(false);

  const onClickVisitationEditClose = () => {
    setIsVisitationEditShown(false);
  };

  const onClickVisitationEditOpen = () => {
    setIsVisitationEditShown(true);
  };

  const onClickVisitationEditDone = async () => {
    const prevResponse = await visitationsApi.getVisitation({
      churchId,
      visitationId: targetVisitation.id,
    });

    const prevVisitation: Visitation = prevResponse.data.data;
    if (!prevVisitation) return;

    try {
      const diffPayload = {
        status:
          targetVisitation.status !== prevVisitation.status
            ? targetVisitation.status
            : undefined,
        title:
          targetVisitation.title !== prevVisitation.title
            ? targetVisitation.title
            : undefined,
        inChargeId:
          targetVisitation.inChargeId !== prevVisitation.inChargeId
            ? targetVisitation.inChargeId
            : undefined,
        startDate:
          targetVisitation.startDate !== prevVisitation.startDate
            ? getFullStringFromDate(
                getDateFromDateString(targetVisitation.startDate)
              )
            : undefined,
        endDate:
          targetVisitation.endDate !== prevVisitation.endDate
            ? getFullStringFromDate(
                getDateFromDateString(targetVisitation.endDate)
              )
            : undefined,
        memberIds:
          JSON.stringify(targetVisitation.members.map((m) => m.id).sort()) !==
          JSON.stringify(prevVisitation.members.map((m) => m.id).sort())
            ? targetVisitation.members.map((m) => m.id)
            : undefined,
      };

      // 변경된 필드만 전송
      await visitationsApi.editVisitation(
        { churchId, visitationId: targetVisitation.id },
        diffPayload
      );

      await visitationsApi.editVisitationDetails(
        { churchId, visitationId: targetVisitation.id },
        {
          visitationContent:
            targetVisitation.visitationDetails[0].visitationContent,
          visitationPray: targetVisitation.visitationDetails[0].visitationPray,
        }
      );

      const prevResponse = await visitationsApi.getVisitation({
        churchId,
        visitationId: targetVisitation.id,
      });

      const prev: Visitation = prevResponse.data.data;

      const reports = prev?.reports;

      const receiverIds = reports?.map((report) => report.receiver.id) || [];

      const addReceiverIds = targetVisitation.receiverIds?.filter(
        (receiverId) => !receiverIds.includes(receiverId)
      );
      const deleteReceiverIds =
        receiverIds?.filter(
          (receiverId) => !targetVisitation.receiverIds?.includes(receiverId)
        ) || [];

      if (addReceiverIds?.length > 0) {
        await visitationsApi.addReceivers(
          {
            churchId,
            visitationId: targetVisitation.id,
          },
          { receiverIds: addReceiverIds }
        );
      }

      if (deleteReceiverIds?.length > 0) {
        await visitationsApi.deleteReceivers(
          {
            churchId,
            visitationId: targetVisitation.id,
          },
          { receiverIds: deleteReceiverIds }
        );
      }

      const response = await visitationsApi.getVisitation({
        churchId,
        visitationId: targetVisitation.id,
      });

      const newVisitation = response.data.data;
      dispatch(setTargetVisitation(newVisitation));

      const newSchedules = calendarSchedules.map((schedule) => {
        if (schedule.id) {
          const [domain, id] = schedule.id.split('-');
          if (domain === DOMAIN.VISITATION && id == targetVisitation.id) {
            return getScheduleFromVisitation(newVisitation);
          } else {
            return schedule;
          }
        } else {
          return schedule;
        }
      });
      dispatch(setCalendarSchedules(newSchedules));

      setIsVisitationEditShown(false);

      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setToastBackgroundColor(BLACK));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  useEffect(() => {
    if (!getIsWellFormedTitle(targetVisitation.title)) {
      setIsVisitationSaveEnabled(false);
      return;
    }
    if (targetVisitation.inChargeId === BLANK) {
      setIsVisitationSaveEnabled(false);
      return;
    }
    if (!targetVisitation.startDate || !targetVisitation.endDate) {
      setIsVisitationSaveEnabled(false);
      return;
    }

    setIsVisitationSaveEnabled(true);
  }, [targetVisitation]);

  const [isEducationSessionEditShown, setIsEducationSessionEditShown] =
    useState<boolean>(false);
  const [isEducationSessionSaveEnabled, setIsEducationSessionSaveEnabled] =
    useState<boolean>(false);

  const onClickEducationSessionEditClose = () => {
    setIsEducationSessionEditShown(false);
  };

  const onClickEducationSessionEditOpen = () => {
    setIsEducationSessionEditShown(true);
  };

  const onClickEducationSessionEditDone = async () => {
    try {
      const response = await educationSessionsApi.getEducationSession({
        churchId,
        educationId: targetEducationTerm.educationId,
        educationTermId: targetEducationTerm.id,
        educationSessionId: targetEducationSession.id,
      });
      const prev: EducationSession = response.data.data;

      await educationSessionsApi.editEducationSession(
        {
          churchId,
          educationId: targetEducationTerm.educationId,
          educationTermId: targetEducationTerm.id,
          educationSessionId: targetEducationSession.id,
        },
        {
          title: targetEducationSession.title || undefined,
          startDate:
            getFullStringFromDate(
              getDateFromDateString(targetEducationSession.startDate)
            ) || undefined,
          endDate:
            getFullStringFromDate(
              getDateFromDateString(targetEducationSession.endDate)
            ) || undefined,
          inChargeId: targetEducationSession.inChargeId || undefined,
          content: targetEducationSession.content || undefined,
        }
      );

      const reports = prev?.reports;

      const receiverIds = reports?.map((report) => report.receiver.id) || [];

      const addReceiverIds = targetEducationSession.receiverIds?.filter(
        (receiverId) => !receiverIds.includes(receiverId)
      );
      const deleteReceiverIds =
        receiverIds?.filter(
          (receiverId) =>
            !targetEducationSession.receiverIds?.includes(receiverId)
        ) || [];

      if (addReceiverIds?.length > 0) {
        await educationSessionsApi.addReceivers(
          {
            churchId,
            educationId: targetEducationTerm.educationId,
            educationTermId: targetEducationTerm.id,
            educationSessionId: targetEducationSession.id,
          },
          { receiverIds: addReceiverIds }
        );
      }

      if (deleteReceiverIds?.length > 0) {
        await educationSessionsApi.deleteReceivers(
          {
            churchId,
            educationId: targetEducationTerm.educationId,
            educationTermId: targetEducationTerm.id,
            educationSessionId: targetEducationSession.id,
          },
          { receiverIds: deleteReceiverIds }
        );
      }

      const sessionResponse = await educationSessionsApi.getEducationSession({
        churchId,
        educationId: targetEducationTerm.educationId,
        educationTermId: targetEducationTerm.id,
        educationSessionId: targetEducationSession.id,
      });

      const newEducationSession = {
        ...sessionResponse.data.data,
        educationAttendances: targetEducationSession.educationAttendances,
      };

      dispatch(setTargetEducationSession(newEducationSession));

      const newSchedules = calendarSchedules.map((schedule) => {
        if (schedule.id) {
          const [domain, id] = schedule.id.split('-');
          if (
            domain === DOMAIN.EDUCATION_SESSION &&
            id == targetEducationSession.id
          ) {
            return getScheduleFromEducationSession(newEducationSession);
          } else {
            return schedule;
          }
        } else {
          return schedule;
        }
      });
      dispatch(setCalendarSchedules(newSchedules));
      setIsEducationSessionEditShown(false);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
    }
  };

  useEffect(() => {
    if (!getIsWellFormedTitle(targetEducationSession.title)) {
      setIsEducationSessionSaveEnabled(false);
      return;
    }
    if (targetEducationSession.inChargeId === BLANK) {
      setIsEducationSessionSaveEnabled(false);
      return;
    }
    if (!targetEducationSession.startDate || !targetEducationSession.endDate) {
      setIsEducationSessionSaveEnabled(false);
      return;
    }

    setIsEducationSessionSaveEnabled(true);
  }, [targetVisitation]);

  const props = {
    date,
    openedDomain,
    isEventEditShown,
    isEventSaveEnable,
    isEventDeleteShown,
    onClickClose,
    onChangeDate,
    onSelectSchedule,
    onChangeTaskStatus,
    onChangeVisitationStatus,
    onChangeEducationSessionStatus,
    onClickEventEditOpen,
    onClickEventEditClose,
    onClickEventEditDone,
    onClickEventDelete,
    onClickEventDeleteOpen,
    onClickEventDeleteClose,

    isTaskEditShown,
    onClickTaskEditClose,
    onClickTaskEditOpen,
    onClickTaskEditDone,
    isTaskSaveEnabled,

    isVisitationEditShown,
    onClickVisitationEditClose,
    onClickVisitationEditOpen,
    onClickVisitationEditDone,
    isVisitationSaveEnabled,

    isEducationSessionEditShown,
    onClickEducationSessionEditClose,
    onClickEducationSessionEditOpen,
    onClickEducationSessionEditDone,
    isEducationSessionSaveEnabled,
  };

  return (
    <>
      <MainCalendarView {...props} />
    </>
  );
};

export default MainCalendar;
