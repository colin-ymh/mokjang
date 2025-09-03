import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Schedule } from '@mokjang/models';
import { VisitationsApi } from '../../../api/visitations/visitations.api';
import { TasksApi } from '../../../api/tasks/tasks.api';
import {
  getScheduleFromBirthday,
  getScheduleFromChurchEvent,
  getScheduleFromEducationSession,
  getScheduleFromHoliday,
  getScheduleFromTask,
  getScheduleFromVisitation,
} from '../../../utils/calendar';
import { Visitation } from '@mokjang/models';
import { Task } from '@mokjang/models';
import { CalendarApi } from '../../../api/calendar/calendar.api';
import { Member } from '@mokjang/models';
import { DOMAIN } from '@mokjang/models';
import { ChurchEventsApi } from '../../../api/church-event/church-events.api';
import { ChurchEvent } from '@mokjang/models';
import { EducationSession } from '@mokjang/models';
import dayjs from 'dayjs';
import { getHolidays, Holiday } from '../../../api/holiday-api';

type CALENDAR_FILTER = {
  isMy: boolean;
  selectedDomains: DOMAIN[];
};

type CalendarFilterState = {
  calendarSchedules: Schedule[];
  calendarFilter: CALENDAR_FILTER;
};

const initialState: CalendarFilterState = {
  calendarSchedules: [],
  calendarFilter: {
    isMy: false,
    selectedDomains: [
      DOMAIN.TASK,
      DOMAIN.VISITATION,
      DOMAIN.EDUCATION_SESSION,
      DOMAIN.MEMBER,
      DOMAIN.HOLIDAY,
      DOMAIN.CHURCH_EVENT,
    ],
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
      return getScheduleFromVisitation(visitation);
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
      return getScheduleFromBirthday(fromDate, toDate, member);
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
      return getScheduleFromTask(task);
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
      return getScheduleFromEducationSession(education);
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

    const newEvents: Schedule[] = allHolidays.map((holiday: Holiday) => {
      return getScheduleFromHoliday(holiday);
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
      return getScheduleFromChurchEvent(event);
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchCalendarSchedules = createAsyncThunk<
  Schedule[],
  { fromDate: string; toDate: string },
  { state: RootState }
>(
  'calendar/fetchCalendarSchedules',
  async ({ fromDate, toDate }, { getState, rejectWithValue }) => {
    const churchId = getState().church.churchId;
    const user = getState().user.user;

    const userId = user.churchUser[0]?.id;

    try {
      let taskEvents: Schedule[] = [];
      let educationEvents: Schedule[] = [];
      let visitationEvents: Schedule[] = [];
      let birthdayEvents: Schedule[] = [];
      let churchEvents: Schedule[] = [];
      let holidayEvents: Schedule[] = [];

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
    setCalendarSchedules: (state, action: PayloadAction<Schedule[]>) => {
      state.calendarSchedules = action.payload;
    },
    setCalendarFilter: (state, action: PayloadAction<CALENDAR_FILTER>) => {
      state.calendarFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchCalendarSchedules.fulfilled,
      (state, action: PayloadAction<Schedule[]>) => {
        state.calendarSchedules = action.payload;
      }
    );
  },
});

export const { setCalendarSchedules, setCalendarFilter } =
  CalendarFilterSlice.actions;

export default CalendarFilterSlice.reducer;
