import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { CalendarEvent } from '@/models/calendar/calendar';
import { VisitationsApi } from '@/api/visitations/visitations.api';
import { TasksApi } from '@/api/tasks/tasks.api';
import {
  getEventFromBirthday,
  getEventFromChurchEvent,
  getEventFromEducation,
  getEventFromHoliday,
  getEventFromTask,
  getEventFromVisitation,
} from '@/utils/calendar';
import { Visitation } from '@/models/visitation/visitation';
import { Task } from '@/models/task/task';
import { CalendarApi } from '@/api/calendar/calendar.api';
import { Member } from '@/models/member/member';
import { DOMAIN } from '@/models/permission/permission';
import { ChurchEventsApi } from '@/api/church-event/church-events.api';
import { ChurchEvent } from '@/models/church-event/church-event';
import { EducationSession } from '@/models/education/education';
import dayjs from 'dayjs';
import { getHolidays, Holiday } from '@/api/holiday-api';

type CALENDAR_FILTER = {
  isMy: boolean;
  selectedDomains: DOMAIN[];
};

type CalendarFilterState = {
  calendarEvents: CalendarEvent[];
  calendarFilter: CALENDAR_FILTER;
};

const initialState: CalendarFilterState = {
  calendarEvents: [],
  calendarFilter: {
    isMy: false,
    selectedDomains: Object.values(DOMAIN) as DOMAIN[],
  },
};

const getCalendarVisitations = async (
  churchId: string,
  fromDate: string,
  toDate: string
) => {
  try {
    const visitationsApi = new VisitationsApi(false);

    const response = await visitationsApi.getVisitations({
      churchId,
      fromStartDate: fromDate,
      toStartDate: toDate,
    });

    const newVisitations = response.data.data;
    const newEvents = newVisitations.map((visitation: Visitation) => {
      return getEventFromVisitation(visitation);
    });

    return newEvents;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getCalendarBirthdays = async (
  churchId: string,
  fromDate: string,
  toDate: string
) => {
  try {
    const calendarApi = new CalendarApi(false);

    const response = await calendarApi.getBirthdays({
      churchId,
      fromDate,
      toDate,
    });

    const newBirthdays = response.data;
    const newEvents = newBirthdays.map((member: Member) => {
      return getEventFromBirthday(fromDate, toDate, member);
    });

    return newEvents;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getCalendarTasks = async (
  churchId: string,
  fromDate: string,
  toDate: string
) => {
  try {
    const tasksApi = new TasksApi(false);

    const response = await tasksApi.getTasks({
      churchId,
      fromStartDate: fromDate,
      toStartDate: toDate,
    });

    const newTasks = response.data.data;
    const newEvents = newTasks.map((task: Task) => {
      return getEventFromTask(task);
    });

    return newEvents;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getCalendarEducations = async (
  churchId: string,
  fromDate: string,
  toDate: string
) => {
  try {
    const calendarApi = new CalendarApi(false);

    const response = await calendarApi.getEducations({
      churchId,
      fromDate,
      toDate,
      // inChargeId: userId || undefined,
    });

    const newEducations = response.data;
    const newEvents = newEducations.map((education: EducationSession) => {
      return getEventFromEducation(education);
    });

    return newEvents;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getCalendarHolidays = async (fromDate: string, toDate: string) => {
  try {
    const start = dayjs(fromDate);
    const end = dayjs(toDate);

    const months: { year: number; month: number }[] = [];
    let current = start.startOf('month');

    while (current.isBefore(end) || current.isSame(end, 'month')) {
      months.push({ year: current.year(), month: current.month() + 1 }); // dayjs는 0-indexed month
      current = current.add(1, 'month');
    }

    const allHolidays: Holiday[] = [];

    for (const { year, month } of months) {
      const holidays: Holiday[] = await getHolidays(
        year.toString(),
        month.toString()
      );
      allHolidays.push(...holidays);
    }

    const newEvents: CalendarEvent[] = allHolidays.map((holiday: Holiday) => {
      return getEventFromHoliday(holiday);
    });

    return newEvents;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getCalendarChurchEvents = async (
  churchId: string,
  fromDate: string,
  toDate: string
) => {
  try {
    const eventsApi = new ChurchEventsApi(false);

    const response = await eventsApi.getChurchEvents({
      churchId,
      fromDate,
      toDate,
    });

    const newEvents = response.data.data;
    return newEvents.map((event: ChurchEvent) => {
      return getEventFromChurchEvent(event);
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchCalendarEvents = createAsyncThunk<
  CalendarEvent[],
  { fromDate: string; toDate: string },
  { state: RootState }
>(
  'calendar/fetchCalendarEvents',
  async ({ fromDate, toDate }, { getState, rejectWithValue }) => {
    const churchId = getState().church.churchId;
    const user = getState().user.user;

    const userId = user.churchUser[0]?.id;

    try {
      let taskEvents: CalendarEvent[] = [];
      let educationEvents: CalendarEvent[] = [];
      let visitationEvents: CalendarEvent[] = [];
      let birthdayEvents: CalendarEvent[] = [];
      let churchEvents: CalendarEvent[] = [];
      let holidayEvents: CalendarEvent[] = [];

      taskEvents = await getCalendarTasks(churchId, fromDate, toDate);

      educationEvents = await getCalendarEducations(churchId, fromDate, toDate);

      visitationEvents = await getCalendarVisitations(
        churchId,
        fromDate,
        toDate
      );

      birthdayEvents = await getCalendarBirthdays(churchId, fromDate, toDate);

      churchEvents = await getCalendarChurchEvents(churchId, fromDate, toDate);

      holidayEvents = await getCalendarHolidays(fromDate, toDate);

      return [
        ...holidayEvents,
        ...birthdayEvents,
        ...taskEvents,
        ...educationEvents,
        ...visitationEvents,
        ...churchEvents,
      ];
    } catch (error) {
      console.error('일정 불러오기 실패', error);
      return rejectWithValue('일정을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

const CalendarFilterSlice = createSlice({
  name: 'calendarFilter',
  initialState,
  reducers: {
    setCalendarEvents: (state, action: PayloadAction<CalendarEvent[]>) => {
      state.calendarEvents = action.payload;
    },
    setCalendarFilter: (state, action: PayloadAction<CALENDAR_FILTER>) => {
      state.calendarFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchCalendarEvents.fulfilled,
      (state, action: PayloadAction<CalendarEvent[]>) => {
        state.calendarEvents = action.payload;
      }
    );
  },
});

export const { setCalendarEvents, setCalendarFilter } =
  CalendarFilterSlice.actions;

export default CalendarFilterSlice.reducer;
