import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HOME_WIDGET } from '@mokjang/constants';
import { Schedule } from '@mokjang/models';

type HomeWidgetsFilterState = {
  homeWidgets: HOME_WIDGET[];
  mySchedules: Schedule[];
  reportedSchedules: Schedule[];
};

const STORAGE_KEY = 'homeFilterState';

// 저장된 상태 불러오기
function loadPersistedState(): Partial<HomeWidgetsFilterState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<HomeWidgetsFilterState>;
  } catch {
    return {};
  }
}

// 필요한 상태만 저장
function savePersistedState(state: HomeWidgetsFilterState) {
  if (typeof window === 'undefined') return;
  const toSave = {
    homeWidgets: state.homeWidgets,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

const persisted = loadPersistedState();

const initialState: HomeWidgetsFilterState = {
  homeWidgets: persisted.homeWidgets ?? Object.values(HOME_WIDGET),
  mySchedules: [],
  reportedSchedules: [],
};

const WorshipFilterSlice = createSlice({
  name: 'homeWidget',
  initialState,
  reducers: {
    setHomeWidgets: (state, action: PayloadAction<HOME_WIDGET[]>) => {
      state.homeWidgets = action.payload;
      savePersistedState(state);
    },
    setMySchedules: (state, action: PayloadAction<Schedule[]>) => {
      state.mySchedules = action.payload;
    },
    setReportedSchedules: (state, action: PayloadAction<Schedule[]>) => {
      state.reportedSchedules = action.payload;
    },
  },
});

export const { setHomeWidgets, setMySchedules, setReportedSchedules } =
  WorshipFilterSlice.actions;
export default WorshipFilterSlice.reducer;
