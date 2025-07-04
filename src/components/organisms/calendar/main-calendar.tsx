import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCalendarEvents } from '@/redux/reducers/filter/calendar-filter-reducer';
import { getDateStringFromDate } from '@/utils/date';
import MainCalendarView from '@/components/organisms/calendar/main-calendar.view';
import { CalendarEvent } from '@/models/calendar/calendar';
import { DOMAIN } from '@/models/permission/permission';
import { setTargetTask } from '@/redux/reducers/target/target-task-reducer';
import { Task } from '@/models/task/task';
import { setTargetVisitation } from '@/redux/reducers/target/target-visitation-reducer';
import { Visitation } from '@/models/visitation/visitation';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';
import { setTargetChurchEvent } from '@/redux/reducers/target/target-church-event-reducer';
import { ChurchEvent } from '@/models/church-event/church-event';
import { setTargetEducationSession } from '@/redux/reducers/target/target-education-session-reducer';
import { CalendarApi } from '@/api/calendar/calendar.api';
import { setTargetEducationTerm } from '@/redux/reducers/target/target-education-term-reducer';
import { EducationTermsApi } from '@/api/education/education-terms.api';
import { EducationAttendanceApi } from '@/api/education/education-attendance.api';
import { MembersApi } from '@/api/members/members.api';
import { EducationsApi } from '@/api/education/educations.api';
import { setTargetEducation } from '@/redux/reducers/target/target-education-reducer';
import { EducationSessionsApi } from '@/api/education/education-sessions.api';

const MainCalendar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);
  // 보고있는 날짜
  const [date, setDate] = useState<Date>(new Date());

  // 상세보기 중인 도메인
  const [openedDomain, setOpenedDomain] = useState<DOMAIN | null>(null);

  // 날짜 변경 시 반영
  const onChangeDate = (date: Date) => {
    setDate(date);
  };

  // 이벤트 선택
  const onSelectEvent = (event: CalendarEvent) => {
    setOpenedDomain(null);
    setTimeout(
      async () => {
        try {
          if (event.id) {
            const [domain, id] = event.id.split('-');

            switch (domain) {
              case DOMAIN.TASK:
                dispatch(setTargetTask(event.task as Task));
                setOpenedDomain(DOMAIN.TASK);
                return;
              case DOMAIN.VISITATION:
                dispatch(setTargetVisitation(event.visitation as Visitation));
                setOpenedDomain(DOMAIN.VISITATION);
                return;
              case DOMAIN.MEMBER:
                if (event.member) {
                  const membersApi = new MembersApi(false);
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
                dispatch(
                  setTargetChurchEvent(event.churchEvent as ChurchEvent)
                );
                setOpenedDomain(DOMAIN.CHURCH_EVENT);
                return;
              case DOMAIN.EDUCATION:
                const calendarApi = new CalendarApi(false);
                const educationsApi = new EducationsApi(false);
                const educationTermsApi = new EducationTermsApi(false);
                const educationSessionsApi = new EducationSessionsApi(false);
                const educationAttendanceApi = new EducationAttendanceApi(
                  false
                );

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

  // 날짜, 필터 내용 변경 시, 일정 리로드
  useEffect(() => {
    const newFromDate = new Date(date);
    const newToDate = new Date(date);
    newFromDate.setMonth(newFromDate.getMonth() - 2);
    newToDate.setMonth(newToDate.getMonth() + 3);

    dispatch(
      fetchCalendarEvents({
        fromDate: getDateStringFromDate(newFromDate),
        toDate: getDateStringFromDate(newToDate),
      })
    );
  }, [date]);

  const props = {
    date,
    openedDomain,
    onClickClose,
    onChangeDate,
    onSelectEvent,
  };

  return (
    <>
      <MainCalendarView {...props} />
    </>
  );
};

export default MainCalendar;
