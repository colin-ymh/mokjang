import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WebviewState {
  isWebview: boolean;
}

const initialState: WebviewState = {
  isWebview: false,
};

const getIsWebview = () => {
  const userAgent = navigator.userAgent;

  const isIOSWebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
    userAgent,
  );
  const isAndroidWebview =
    /wv/.test(userAgent) ||
    /Android.*Version\/[0-9\.]+.*Chrome\/[0-9\.]+ Mobile/i.test(userAgent);

  return isIOSWebview || isAndroidWebview;
};

const WebviewSlice = createSlice({
  name: "webview",
  initialState,
  reducers: {
    setIsWebview(state, action: PayloadAction<boolean>) {
      state.isWebview = action.payload;
    },
    initializeIsWebview(state) {
      state.isWebview = getIsWebview();
    },
  },
});

export const { setIsWebview, initializeIsWebview } = WebviewSlice.actions;
export default WebviewSlice.reducer;
