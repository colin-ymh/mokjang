import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HOME_WIDGET } from '../../../constants/constant';

type HomeWidgetsFilterState = {
  homeWidgets: HOME_WIDGET[];
};

const initialState: HomeWidgetsFilterState = {
  homeWidgets: Object.values(HOME_WIDGET),
};

const WorshipFilterSlice = createSlice({
  name: 'homeWidget',
  initialState,
  reducers: {
    setHomeWidgets: (state, action: PayloadAction<HOME_WIDGET[]>) => {
      state.homeWidgets = action.payload;
    },
  },
});

export const { setHomeWidgets } = WorshipFilterSlice.actions;
export default WorshipFilterSlice.reducer;
