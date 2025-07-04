import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent } from '@/models/calendar/calendar';
import styled from 'styled-components';
import { MAIN, WHITE } from '@/constants/styles/color';
import CustomCalendarHeader from '@/vendor/calendar/custom-calendar-header';

import 'moment/locale/ko';
import { useParams } from 'next/navigation';
import CustomDateHeader from '@/vendor/calendar/custom-date-header';
import { getEventStyle } from '@/utils/color';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { DOMAIN } from '@/models/permission/permission';

const CustomCalendarContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;

  .rbc-month-view {
    border-radius: 10px;
  }

  // 요일 헤더
  .rbc-header {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #ddd;

    &:last-child {
      border-right: 1px solid transparent};
    }
  }

  .rbc-header + .rbc-header {
    border-left: none;
  }

  // 월간달력 한 주의 열 (껍데기)
  .rbc-month-row {
    display: flex;
    flex-direction: column;
    overflow: visible;
  }

  // Month Row의 content (스크롤 컨테이너를 담는 껍데기)
  .rbc-row-content {
    display: flex;
  }

  // row-content의 하위의 scroll container
  // 실질적인 내용이 들어감
  // 스크롤은 비활성화
  .rbc-row-content-scroll-container {
    display: flex;
    flex-direction: column;
    overflow: visible;
    gap: 2px;
    min-height: 100px;
  }

  // 이벤트 스타일
  .rbc-event {
    background: ${MAIN.DEFAULT};
    border-radius: 4px;
    color: ${WHITE};
    padding: 2px 5px;
    font-size: 14px;
  }
`;

type CustomCalendarProps = {
  events: CalendarEvent[];
  date: Date;
  onChangeDate: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent) => void;
};

const CustomCalendar = ({
  events,
  date,
  onChangeDate,
  onSelectEvent,
}: CustomCalendarProps) => {
  const params = useParams();
  moment.locale(params.locale as string);
  const localizer = momentLocalizer(moment);

  const { calendarFilter } = useSelector(
    (state: RootState) => state.calendarFilter
  );
  const { user } = useSelector((state: RootState) => state.user);

  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);

  // 필터 값에 따라 이벤트 필터링
  const getFilteredEvent = (events: CalendarEvent[]) => {
    return events.filter((event) => {
      if (event.id) {
        // 도메인 확인
        const [domain, id] = event.id?.split('-');
        if (calendarFilter.selectedDomains.includes(domain as DOMAIN)) {
          // 내 업무 확인
          if (calendarFilter.isMy) {
            switch (domain) {
              case DOMAIN.VISITATION:
                if (
                  event.visitation?.inChargeId === user.churchUser[0].memberId
                ) {
                  return true;
                }
                break;
              case DOMAIN.TASK:
                if (event.task?.inChargeId === user.churchUser[0].memberId) {
                  return true;
                }
                break;
              case DOMAIN.EDUCATION:
                if (
                  event.education?.inChargeId === user.churchUser[0].memberId
                ) {
                  return true;
                }
                break;
              default:
                return false;
            }
          }
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
  };

  useEffect(() => {
    setFilteredEvents(getFilteredEvent(events));
  }, [events, calendarFilter]);

  return (
    <CustomCalendarContainer>
      <Calendar
        date={date}
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        showAllEvents={true}
        onNavigate={onChangeDate}
        style={{ width: '100%', height: '100%' }}
        eventPropGetter={getEventStyle}
        components={{
          toolbar: CustomCalendarHeader,
          month: {
            dateHeader: CustomDateHeader,
          },
        }}
        onSelectEvent={onSelectEvent}
      />
    </CustomCalendarContainer>
  );
};

export default CustomCalendar;
