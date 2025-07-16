import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLACK, WHITE } from '@/constants/styles/color';
import { BLANK } from '@/constants/constant';

type ToastPopupState = {
  isToastShown: boolean;
  toastColor: string;
  toastBackgroundColor: string;
  toastText: string;
};

const initialState: ToastPopupState = {
  isToastShown: false,
  toastColor: WHITE,
  toastBackgroundColor: BLACK,
  toastText: BLANK,
};

const ToastPopupSlice = createSlice({
  name: 'toastPopup',
  initialState,
  reducers: {
    setIsToastShown(state, action: PayloadAction<boolean>) {
      state.isToastShown = action.payload;
    },
    setToastColor(state, action: PayloadAction<string>) {
      state.toastColor = action.payload;
    },
    setToastBackgroundColor(state, action: PayloadAction<string>) {
      state.toastBackgroundColor = action.payload;
    },
    setToastText(state, action: PayloadAction<string>) {
      state.toastText = action.payload;
    },
  },
});

export const {
  setIsToastShown,
  setToastColor,
  setToastBackgroundColor,
  setToastText,
} = ToastPopupSlice.actions;

export default ToastPopupSlice.reducer;
