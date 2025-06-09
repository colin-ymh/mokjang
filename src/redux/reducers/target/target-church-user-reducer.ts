import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ChurchUser,
  DEFAULT_CHURCH_USER,
} from '@/models/church-user/church-user';

type TargetChurchUserState = {
  targetChurchUser: ChurchUser;
};

const initialState: TargetChurchUserState = {
  targetChurchUser: DEFAULT_CHURCH_USER,
};

const TargetChurchUserSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setTargetChurchUser(state, action: PayloadAction<ChurchUser>) {
      state.targetChurchUser = action.payload;
    },
  },
});

export const { setTargetChurchUser } = TargetChurchUserSlice.actions;
export default TargetChurchUserSlice.reducer;
