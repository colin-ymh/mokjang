import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type WebviewState = {
  isWebview: boolean;
};

const initialState: WebviewState = {
  isWebview: false,
};

const WebviewSlice = createSlice({
  name: 'webview',
  initialState,
  reducers: {
    setIsWebview(state, action: PayloadAction<boolean>) {
      state.isWebview = action.payload;
    },
  },
});

export const { setIsWebview } = WebviewSlice.actions;
export default WebviewSlice.reducer;
