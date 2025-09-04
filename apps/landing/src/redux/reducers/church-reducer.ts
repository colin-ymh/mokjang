import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK } from '@mokjang/constants';
import { Church, DEFAULT_CHURCH } from '@mokjang/models';

type ChurchState = {
  churchId: string;
  church: Church;
};

const initialState: ChurchState = {
  churchId: BLANK,
  church: DEFAULT_CHURCH,
};

const ChurchSlice = createSlice({
  name: 'church',
  initialState,
  reducers: {
    setChurchId(state, action: PayloadAction<string>) {
      state.churchId = action.payload;
    },
    setChurch(state, action: PayloadAction<Church>) {
      state.church = action.payload;
    },
  },
});

export const { setChurchId, setChurch } = ChurchSlice.actions;

export default ChurchSlice.reducer;
