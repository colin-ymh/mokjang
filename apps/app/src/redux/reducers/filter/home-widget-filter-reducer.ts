import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HOME_WIDGET } from '@mokjang/constants';
import { Schedule } from '@mokjang/models';

type HomeWidgetsFilterState = {
  homeWidgets: HOME_WIDGET[];
  mySchedules: Schedule[];
  reportedSchedules: Schedule[];
};

const initialState: HomeWidgetsFilterState = {
  homeWidgets: Object.values(HOME_WIDGET),
  mySchedules: [],
  reportedSchedules: [],
};

const WorshipFilterSlice = createSlice({
  name: 'homeWidget',
  initialState,
  reducers: {
    setHomeWidgets: (state, action: PayloadAction<HOME_WIDGET[]>) => {
      state.homeWidgets = action.payload;
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
