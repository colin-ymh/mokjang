import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DOMAIN, Schedule } from '@mokjang/models';
import styled from 'styled-components';
import { GRAY, MAIN, RED, WHITE } from '@mokjang/constants';
import CustomCalendarHeader from './custom-calendar-header';

import 'moment/locale/ko';
import { useParams } from 'next/navigation';
import CustomDateHeader from './custom-date-header';
import { getEventStyle } from '@/utils/color';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import CustomEvent from '@/vendor/calendar/custom-event';

const CustomCalendarContainer = styled.div`
  display: flex;
  width: 100%;
  /* 달력 전체 컨테이너에 ‘가짜 MonthContainer’ 역할을 시킴 */
  .rbc-calendar {
    padding: 0; /* 헤더에 패딩이 들어가지 않도록 부모 패딩 제거 */
    display: flex;
    flex-direction: column;
  }

  .rbc-toolbar {
    margin: 0; /* 부모 패딩을 더 이상 상쇄할 필요 없음 */
    padding: 0;
  }

  .rbc-month-view {
    /* 모서리 안쪽 여백 없이, 바깥 여백만 부여 */
    //margin: 20px;
    //width: calc(100% - 40px); /* 좌우 마진 만큼 줄여 overflow 방지 */
    //border-radius: 10px;
    //overflow: hidden;
    //padding: 0;
    //box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 테두리 대신 그림자 */
    border: none;
    background-color: ${WHITE};
  }

  // 요일 헤더
  .rbc-header {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    height: 50px;
    font-size: 14px;
    font-weight: 400;
    font-family: 'Pretendard', sans-serif;
    color: ${GRAY.DARK};
    border-color: ${GRAY.LIGHT};
  }

  .rbc-month-view .rbc-date-cell {
    border-color: ${GRAY.LIGHT};
  }
  .rbc-month-row,
  .rbc-day-bg {
    border-color: ${GRAY.LIGHT};
  }

  /* 다른 달(오프 레인지) 날짜 배경/텍스트 스타일 */
  .rbc-off-range-bg {
    background-color: ${GRAY.SUPER_LIGHT};
  }
  /* 오늘 날짜 강조 배경 제거 */
  .rbc-today {
    background-color: transparent;
  }

  /* Sunday */
  .rbc-month-view .rbc-header:first-child {
    color: ${RED.DEFAULT};
  }

  /* Saturday */
  .rbc-month-view .rbc-header:last-child {
    color: ${MAIN.DEFAULT};
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
  schedules: Schedule[];
  date: Date;
  onChangeDate: (date: Date) => void;
  onSelectSchedule: (event: Schedule) => void;
};

const CustomCalendar = ({
  schedules,
  date,
  onChangeDate,
  onSelectSchedule,
}: CustomCalendarProps) => {
  const params = useParams();
  moment.locale(params.locale as string);
  const localizer = momentLocalizer(moment);

  const { calendarFilter } = useSelector(
    (state: RootState) => state.calendarFilter
  );
  const { user } = useSelector((state: RootState) => state.user);

  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);

  // 필터 값에 따라 이벤트 필터링
  const getFilteredSchedule = (events: Schedule[]) => {
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
              case DOMAIN.EDUCATION_SESSION:
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
    setFilteredSchedules(getFilteredSchedule(schedules));
  }, [schedules, calendarFilter]);

  return (
    <CustomCalendarContainer>
      <Calendar
        date={date}
        localizer={localizer}
        events={filteredSchedules}
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
            event: CustomEvent,
          },
        }}
        onSelectEvent={onSelectSchedule}
      />
    </CustomCalendarContainer>
  );
};

export default CustomCalendar;
