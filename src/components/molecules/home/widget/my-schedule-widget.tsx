'use client';

import { HomeApi } from '@/api/home/home.api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { RANGE } from '@/constants/constant';
import { DOMAIN } from '@/models/permission/permission';
import { Schedule, ServerSchedule } from '@/models/calendar/calendar';
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
import { getMyWidgetSchedule } from '@/utils/calendar';
import MyScheduleWidgetView from '@/components/molecules/home/widget/my-schedule-widget.view';
import { TasksApi } from '@/api/tasks/tasks.api';
import { VisitationsApi } from '@/api/visitations/visitations.api';

const MyScheduleWidget = () => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId = useSelector((state: RootState) => state.church.churchId);
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

      const newSchedules = response.data;
      const newMySchedules = newSchedules.map((schedule: ServerSchedule) => {
        return getMyWidgetSchedule(schedule);
      });

      setMySchedules(newMySchedules);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 이벤트 선택
  const onClickSchedule = (event: Schedule) => {
    setOpenedDomain(null);
    setTimeout(
      async () => {
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
              case DOMAIN.EDUCATION:
                const sessionResponse = await calendarApi.getEducationDetail({
                  churchId,
                  educationSessionId: id,
                });
                const newEducationSession = sessionResponse.data;

                const termResponse = await educationTermsApi.getEducationTerm({
                  churchId,
                  educationId: newEducationSession.educationTerm.education.id,
                  educationTermId: newEducationSession.educationTerm.id,
                });
                const newEducationTerm = termResponse.data.data;

                const educationResponse = await educationsApi.getEducation({
                  churchId,
                  educationId: newEducationSession.educationTerm.education.id,
                });
                const newEducation = educationResponse.data;

                const sessionsResponse =
                  await educationSessionsApi.getEducationSessions({
                    churchId,
                    educationId: newEducation.id,
                    educationTermId: newEducationTerm.id,
                  });

                const newEducationSessions = sessionsResponse.data.data;

                const attendanceResponse =
                  await educationAttendanceApi.getEducationAttendances({
                    churchId,
                    educationId: newEducationTerm.educationId,
                    educationTermId: newEducationTerm.id,
                    sessionId: newEducationSession.id,
                  });
                const newEducationAttendances = attendanceResponse.data.data;

                dispatch(setTargetEducation(newEducation));
                dispatch(
                  setTargetEducationTerm({
                    ...newEducationTerm,
                    educationSessions: newEducationSessions,
                  })
                );
                dispatch(
                  setTargetEducationSession({
                    ...newEducationSession,
                    educationAttendances: newEducationAttendances,
                  })
                );
                setOpenedDomain(DOMAIN.EDUCATION);
                return;
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
      openedDomain ? 500 : 0
    );
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

  const props = {
    openedDomain,
    range,
    mySchedules,
    onClickSchedule,
    onClickClose,
    onClickRange,
  };
  return (
    <>
      <MyScheduleWidgetView {...props} />
    </>
  );
};

export default MyScheduleWidget;
