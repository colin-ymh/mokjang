import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_USER, User } from '@mokjang/models';

type UserState = {
  user: User;
};

const initialState: UserState = {
  user: DEFAULT_USER,
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = UserSlice.actions;

export default UserSlice.reducer;
