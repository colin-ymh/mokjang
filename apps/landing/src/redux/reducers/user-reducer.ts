import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_USER, User } from '@mokjang/models';

export type UserState = {
  user: User;
  /** 유저 정보 로딩(초기화)이 끝났는지 여부 */
  initialized: boolean;
};

const initialState: UserState = {
  user: DEFAULT_USER,
  initialized: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * 유저 정보를 저장하고 초기화를 완료 상태로 변경
     */
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.initialized = true;
    },
    /**
     * 유저 초기화를 완료 상태로만 설정 (user는 그대로 두기)
     * - 서버 요청이 실패했을 때도 한 번은 호출해 초기화 완료를 알려줄 때 사용
     */
    setUserInitialized(state) {
      state.initialized = true;
    },
    /**
     * 로그아웃이나 사용자 초기화가 필요할 때 사용
     */
    resetUser(state) {
      state.user = DEFAULT_USER;
      state.initialized = false;
    },
  },
});

export const { setUser, setUserInitialized, resetUser } = userSlice.actions;
export default userSlice.reducer;
