import * as React from 'react';
import { useEffect, useState } from 'react';
import CustomCalendar from '@/vendor/calendar/custom-calendar';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCalendarEvents } from '@/redux/reducers/filter/calendar-filter-reducer';
import { getDateStringFromDate } from '@/utils/date';

const CalendarContainer = styled.div`
  display: flex;
  height: 100%;
  overflow-y: auto;
`;

const MainCalendar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { calendarEvents, calendarFilter } = useSelector(
    (state: RootState) => state.calendarFilter
  );

  // 보고있는 날짜
  const [date, setDate] = useState<Date>(new Date());

  // 날짜 변경 시 반영
  const onChangeDate = (date: Date) => {
    setDate(date);
  };

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
  }, [date, calendarFilter]);

  return (
    <CalendarContainer>
      <CustomCalendar
        date={date}
        onChangeDate={onChangeDate}
        events={calendarEvents}
      />
    </CalendarContainer>
  );
};

export default MainCalendar;
