import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import {
  ChurchEvent,
  DOMAIN,
  EducationSession,
  Member,
  Schedule,
  Task,
  Visitation,
} from '@mokjang/models';
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
import { CalendarApi } from '../../../api/calendar/calendar.api';
import { ChurchEventsApi } from '../../../api/church-event/church-events.api';
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

// ------------------ LocalStorage Persist ------------------
const STORAGE_KEY = 'calendarFilterState';

function loadPersistedFilter(): Partial<CalendarFilterState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<CalendarFilterState>) : {};
  } catch {
    return {};
  }
}

function savePersistedFilter(state: CalendarFilterState) {
  if (typeof window === 'undefined') return;
  const toSave = { calendarFilter: state.calendarFilter };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}
// ----------------------------------------------------------

const persisted = loadPersistedFilter();

const initialState: CalendarFilterState = {
  calendarSchedules: [],
  calendarFilter: persisted.calendarFilter ?? {
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
    return response.data.data.map((v: Visitation) =>
      getScheduleFromVisitation(v)
    );
  } catch (error) {
    console.error(error);
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
    return response.data.map((m: Member) =>
      getScheduleFromBirthday(fromDate, toDate, m)
    );
  } catch (error) {
    console.error(error);
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
    return response.data.data.map((t: Task) => getScheduleFromTask(t));
  } catch (error) {
    console.error(error);
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
    });
    return response.data.map((e: EducationSession) =>
      getScheduleFromEducationSession(e)
    );
  } catch (error) {
    console.error(error);
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
      months.push({ year: current.year(), month: current.month() + 1 });
      current = current.add(1, 'month');
    }

    const all: Holiday[] = [];
    for (const { year, month } of months) {
      const h = await getHolidays(year.toString(), month.toString());
      all.push(...h);
    }
    return all.map((h) => getScheduleFromHoliday(h));
  } catch (error) {
    console.error(error);
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
    return response.data.data.map((e: ChurchEvent) =>
      getScheduleFromChurchEvent(e)
    );
  } catch (error) {
    console.error(error);
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
    try {
      const [task, edu, vis, birth, church, holi] = await Promise.all([
        getCalendarTasks(churchId, fromDate, toDate),
        getCalendarEducations(churchId, fromDate, toDate),
        getCalendarVisitations(churchId, fromDate, toDate),
        getCalendarBirthdays(churchId, fromDate, toDate),
        getCalendarChurchEvents(churchId, fromDate, toDate),
        getCalendarHolidays(fromDate, toDate),
      ]);
      return [...holi, ...birth, ...task, ...edu, ...vis, ...church];
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
      savePersistedFilter(state); // 변경 시 저장
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
