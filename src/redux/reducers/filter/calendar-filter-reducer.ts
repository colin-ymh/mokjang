import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { CalendarEvent } from '@/models/calendar/calendar';
import { VisitationsApi } from '@/api/visitations/visitations.api';
import { TasksApi } from '@/api/tasks/tasks.api';
import {
  getEventFromBirthday,
  getEventFromTask,
  getEventFromVisitation,
} from '@/utils/calendar';
import { Visitation } from '@/models/visitation/visitation';
import { Task } from '@/models/task/task';
import { CalendarApi } from '@/api/calendar/calendar.api';
import { Member } from '@/models/member/member';
import { DOMAIN } from '@/models/permission/permission';

type CALENDAR_FILTER = {
  isMy: boolean;
  selectedDomains: DOMAIN[];
};

type CalendarFilterState = {
  calendarFilter: CALENDAR_FILTER;
  calendarEvents: CalendarEvent[];
};

const initialState: CalendarFilterState = {
  calendarEvents: [],
  calendarFilter: {
    isMy: false,
    selectedDomains: Object.values(DOMAIN),
  },
};

const getCalendarVisitations = async (
  churchId: string,
  fromDate: string,
  toDate: string,
  userId?: string
) => {
  try {
    const visitationsApi = new VisitationsApi(false);

    const response = await visitationsApi.getVisitations({
      churchId,
      fromStartDate: fromDate,
      toStartDate: toDate,
      inChargeId: userId || undefined,
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
  toDate: string,
  userId?: string
) => {
  try {
    const tasksApi = new TasksApi(false);

    const response = await tasksApi.getTasks({
      churchId,
      fromStartDate: fromDate,
      toStartDate: toDate,
      inChargeId: userId || undefined,
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

export const fetchCalendarEvents = createAsyncThunk<
  CalendarEvent[],
  { fromDate: string; toDate: string },
  { state: RootState }
>(
  'calendar/fetchCalendarEvents',
  async ({ fromDate, toDate }, { getState, rejectWithValue }) => {
    const churchId = getState().church.churchId;
    const user = getState().user.user;
    const { isMy, selectedDomains } = getState().calendarFilter.calendarFilter;

    const userId = user.churchUser[0]?.id;

    try {
      let taskEvents = [];
      let visitationEvents = [];
      let birthdayEvents = [];

      if (selectedDomains.includes(DOMAIN.TASK)) {
        taskEvents = await getCalendarTasks(
          churchId,
          fromDate,
          toDate,
          isMy ? userId : undefined
        );
      }

      if (selectedDomains.includes(DOMAIN.VISITATION)) {
        visitationEvents = await getCalendarVisitations(
          churchId,
          fromDate,
          toDate,
          isMy ? userId : undefined
        );
      }

      if (selectedDomains.includes(DOMAIN.MEMBER) && !isMy) {
        birthdayEvents = await getCalendarBirthdays(churchId, fromDate, toDate);
      }

      return [...taskEvents, ...visitationEvents, ...birthdayEvents];
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
